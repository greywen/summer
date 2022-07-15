import { UserDepartment } from '@entities/user.department.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import KcClient from '@utils/kcClient';
import { Repository } from 'typeorm';

@Injectable()
export class UserDepartmentService {
  constructor(
    @InjectRepository(UserDepartment)
    private readonly userDepartmentRepository: Repository<UserDepartment>,
  ) {}

  async getDepartmentMembers(departmentids: number[]) {
    const query = await this.userDepartmentRepository.createQueryBuilder();
    // Eg:
    // SELECT * FROM "user_department" WHERE (departmentids)::jsonb ? '77759326-cd81-43b3-b31f-a76495c7f1ba';
    // SELECT * FROM "user_department" WHERE departmentids @> '["77759326-cd81-43b3-b31f-a76495c7f1ba","5104abac-1406-4357-bb82-d9066b689f4d"]';
    const data = await query
      .where(`departmentids @> '${JSON.stringify(departmentids)}'`)
      .getMany();
    const userids = data.map((x) => x.userid);
    const users = await KcClient.kcAdminClient.users.find();
    return users.filter((x) => userids.includes(x.id));
  }
}
