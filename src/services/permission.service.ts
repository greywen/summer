// import { UserDepartment } from '@entities/user.department.entity';
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// @Injectable()
// export class PermissionService {
//   constructor(
//     @InjectRepository(DepartmentPermission)
//     private readonly departmentRepository: Repository<DepartmentPermission>,
//   ) {}

//   async getDepartmentMembers(departmentids: string[]) {
//     const query = await this.departmentRepository.createQueryBuilder();
//     const data = await query
//       .where(`departmentid in ${departmentids.join(',')}`)
//       .getMany();
//     const permissions = data.map((x) => x.permissions.join(','));
//     return permissions;
//   }
// }
