import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { UserRole } from '@/common/enums/enums';
import { User } from '@/modules/users/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findOne({ email, username }: Partial<User>) {
    return this.repo.find({ where: { email, username } });
  }

  async findById(
    id: string,
    options?: {
      select?: FindOptionsSelect<User>;
      relations?: FindOptionsRelations<User>;
    },
  ) {
    return this.repo.findOne({
      where: { id },
      select: options?.select,
      relations: options?.relations,
    });
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findByResetToken(tokenHash: string) {
    return this.repo.findOne({ where: { resetToken: tokenHash } });
  }

  async save(user: User) {
    return this.repo.save(user);
  }

  async create(
    email: string,
    password: string,
    username: string,
    role: UserRole,
  ) {
    const user = this.repo.create({
      email,
      role,
      password,
      username,
    });

    return this.repo.save(user);
  }

  async update(id: string, attr: Partial<User>) {
    const result = await this.repo.update(id, attr);

    if (result.affected === 0) throw new NotFoundException('User not found');
    return result;
  }
}
