import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Auth } from './auth.entity';

@Entity('auth_credentials')
export class AuthCredentials {
  @Column({ type: 'varchar', primary: true })
  id: string;

  @Column({ type: 'varchar' })
  password: string;

  @OneToOne(() => Auth, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Auth;
}
