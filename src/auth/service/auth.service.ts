import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { compare, genSalt, hash } from 'bcrypt';
import { AuthUser, JwtPayload, UserSignIn, UserRegister } from '../dto';
import { JwtService } from '@nestjs/jwt';
import { Auth, AuthCredentials } from '../entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private userRepo: Repository<Auth>,
    @InjectRepository(AuthCredentials)
    private userCredentialsRepo: Repository<AuthCredentials>,
    private jwtService: JwtService,
  ) {}

  async userRegister(userDetail: UserRegister): Promise<AuthUser> {
    try {
      const { email, password, abilities } = userDetail;

      // password encryption
      const salt = await genSalt();
      const hashedPassword = await hash(password, salt);

      const user = this.userRepo.create({ id: uuid(), email, abilities });
      await this.userRepo.save(user);

      const userCredentials = this.userCredentialsRepo.create({
        id: uuid(),
        password: hashedPassword,
      });

      // save user detail
      const registeredUser = {
        id: user.id,
        email: user.email,
        abilities: user.abilities,
      };

      // save user credentials
      if (registeredUser.id) {
        userCredentials.user = user;
        await this.userCredentialsRepo.save(userCredentials);
      }

      return registeredUser;
    } catch (error) {
      // MySqlError Duplicate entry
      if (error.errno === 1062 && error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email value is already taken');
      } else {
        // console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async userSignIn(userCredential: UserSignIn): Promise<any> {
    const { email, password } = userCredential;

    try {
      // fetch user detail
      const user = await this.userRepo.findOneBy({ email: email });

      if (user) {
        const userCredentials = await this.userCredentialsRepo.findOne({
          where: { user: user },
        });

        // compare user credentials
        const validUser = await compare(password, userCredentials.password);

        if (validUser) {
          // generating access token
          const payload: JwtPayload = {
            email: user.email,
            id: user.id,
            abilities: user.abilities,
          };
          const accessToken: string = await this.jwtService.sign(payload);

          return { accessToken };
        }
      }

      throw new UnauthorizedException('please check your sigin credentials');
    } catch (error) {
      if (error.status == 401) {
        return error.response;
      }
      // console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
