import { Column, Entity } from 'typeorm';

@Entity('auth')
export class Auth {
  @Column({ type: 'varchar', primary: true })
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  abilities: string;
}
