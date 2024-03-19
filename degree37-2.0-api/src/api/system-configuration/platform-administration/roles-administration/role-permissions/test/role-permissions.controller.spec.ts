import { Test, TestingModule } from '@nestjs/testing';
import { RolePermissionsController } from '../controllers/role-permissions.controller';
import { RolePermissionsService } from '../services/role-permissions.service';
import { ArchiveRoleInterface } from '../interface/archiveRole.interface';
import { UpdateRolePermissionDto } from '../dto/update-role-permission.dto';
import { HttpStatus } from '@nestjs/common';
import { UserRequest } from 'src/common/interface/request';

describe('RolePermissionsController', () => {
  let rolePermissionscontroller: RolePermissionsController;
  let rolePermissionsService: RolePermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolePermissionsController],
      providers: [
        {
          provide: RolePermissionsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            findAllRoles: jest.fn(),
            findOneRole: jest.fn(),
            archiveRole: jest.fn(),
            updateRole: jest.fn(),
          },
        },
      ],
    }).compile();
    rolePermissionscontroller = module.get<RolePermissionsController>(
      RolePermissionsController
    );
    rolePermissionsService = module.get<RolePermissionsService>(
      RolePermissionsService
    );
  });

  describe('listOfAllPermissions', () => {
    const permisionSearch = {
      name: '',
    };

    const permissions: any = {
      status: 'success',
      respons: 'Permission Fetched Successfully',
      code: 200,
      data: {
        application: [
          {
            name: 'System Configuration',
            modules: {
              id: '1',
              code: 'organizational_administration',
              name: 'Organizational Administration',
              parent_id: null,
              created_at: '2023-08-01T09:15:35.893Z',
              permissions: [],
              child_modules: [
                {
                  id: '2',
                  code: 'hierarchy',
                  name: 'Hierarchy',
                  parent_id: '1',
                  created_at: '2023-08-01T09:15:35.900Z',
                  permissions: [],
                  child_modules: [
                    {
                      id: '4',
                      code: 'business_units',
                      name: 'Business Units',
                      parent_id: '2',
                      created_at: '2023-08-01T09:15:35.918Z',
                      permissions: [
                        {
                          id: '6',
                          name: 'Archive',
                          code: 'system_conf.organizational_administration.hierarchy.business_units.archive',
                          created_at: '2023-08-01T09:15:35.928Z',
                        },
                        {
                          id: '5',
                          name: 'Write',
                          code: 'system_conf.organizational_administration.hierarchy.business_units.write',
                          created_at: '2023-08-01T09:15:35.925Z',
                        },
                        {
                          id: '4',
                          name: 'Read',
                          code: 'system_conf.organizational_administration.hierarchy.business_units.read',
                          created_at: '2023-08-01T09:15:35.921Z',
                        },
                      ],
                      child_modules: [],
                    },
                    {
                      id: '3',
                      code: 'organizational_levels',
                      name: 'Organizational Levels',
                      parent_id: '2',
                      created_at: '2023-08-01T09:15:35.903Z',
                      permissions: [
                        {
                          id: '3',
                          name: 'Archive',
                          code: 'system_conf.organizational_administration.hierarchy.organizational_levels.archive',
                          created_at: '2023-08-01T09:15:35.915Z',
                        },
                        {
                          id: '2',
                          name: 'Write',
                          code: 'system_conf.organizational_administration.hierarchy.organizational_levels.write',
                          created_at: '2023-08-01T09:15:35.911Z',
                        },
                        {
                          id: '1',
                          name: 'Read',
                          code: 'system_conf.organizational_administration.hierarchy.organizational_levels.read',
                          created_at: '2023-08-01T09:15:35.906Z',
                        },
                      ],
                      child_modules: [],
                    },
                  ],
                },
                {
                  id: '5',
                  code: 'goals',
                  name: 'Goals',
                  parent_id: '1',
                  created_at: '2023-08-01T09:15:35.932Z',
                  permissions: [],
                  child_modules: [
                    {
                      id: '8',
                      code: 'daily_goals_calendar',
                      name: 'Daily Goals Calendar',
                      parent_id: '5',
                      created_at: '2023-08-01T09:15:35.956Z',
                      permissions: [
                        {
                          id: '15',
                          name: 'Archive',
                          code: 'system_conf.organizational_administration.goals.daily_goals_calendar.archive',
                          created_at: '2023-08-01T09:15:35.965Z',
                        },
                        {
                          id: '14',
                          name: 'Write',
                          code: 'system_conf.organizational_administration.goals.daily_goals_calendar.write',
                          created_at: '2023-08-01T09:15:35.963Z',
                        },
                        {
                          id: '13',
                          name: 'Read',
                          code: 'system_conf.organizational_administration.goals.daily_goals_calendar.read',
                          created_at: '2023-08-01T09:15:35.959Z',
                        },
                      ],
                      child_modules: [],
                    },
                    {
                      id: '6',
                      code: 'monthly_goals',
                      name: 'Monthly Goals',
                      parent_id: '5',
                      created_at: '2023-08-01T09:15:35.935Z',
                      permissions: [
                        {
                          id: '9',
                          name: 'Archive',
                          code: 'system_conf.organizational_administration.goals.monthly_goals.archive',
                          created_at: '2023-08-01T09:15:35.943Z',
                        },
                        {
                          id: '8',
                          name: 'Write',
                          code: 'system_conf.organizational_administration.goals.monthly_goals.write',
                          created_at: '2023-08-01T09:15:35.940Z',
                        },
                        {
                          id: '7',
                          name: 'Read',
                          code: 'system_conf.organizational_administration.goals.monthly_goals.read',
                          created_at: '2023-08-01T09:15:35.938Z',
                        },
                      ],
                      child_modules: [],
                    },
                    {
                      id: '9',
                      code: 'performance_rules',
                      name: 'Performance Rules',
                      parent_id: '5',
                      created_at: '2023-08-01T09:15:35.967Z',
                      permissions: [
                        {
                          id: '18',
                          name: 'Archive',
                          code: 'system_conf.organizational_administration.goals.performance_rules.archive',
                          created_at: '2023-08-01T09:15:35.974Z',
                        },
                        {
                          id: '17',
                          name: 'Write',
                          code: 'system_conf.organizational_administration.goals.performance_rules.write',
                          created_at: '2023-08-01T09:15:35.972Z',
                        },
                        {
                          id: '16',
                          name: 'Read',
                          code: 'system_conf.organizational_administration.goals.performance_rules.read',
                          created_at: '2023-08-01T09:15:35.970Z',
                        },
                      ],
                      child_modules: [],
                    },
                    {
                      id: '7',
                      code: 'daily_goals_allocation',
                      name: 'Daily Goals Allocation',
                      parent_id: '5',
                      created_at: '2023-08-01T09:15:35.945Z',
                      permissions: [
                        {
                          id: '12',
                          name: 'Archive',
                          code: 'system_conf.organizational_administration.goals.daily_goals_allocation.archive',
                          created_at: '2023-08-01T09:15:35.953Z',
                        },
                        {
                          id: '11',
                          name: 'Write',
                          code: 'system_conf.organizational_administration.goals.daily_goals_allocation.write',
                          created_at: '2023-08-01T09:15:35.951Z',
                        },
                        {
                          id: '10',
                          name: 'Read',
                          code: 'system_conf.organizational_administration.goals.daily_goals_allocation.read',
                          created_at: '2023-08-01T09:15:35.948Z',
                        },
                      ],
                      child_modules: [],
                    },
                  ],
                },
                {
                  id: '10',
                  code: 'products_procedures',
                  name: 'Products & Procedures',
                  parent_id: '1',
                  created_at: '2023-08-01T09:15:35.976Z',
                  permissions: [],
                  child_modules: [
                    {
                      id: '11',
                      code: 'products',
                      name: 'Products',
                      parent_id: '10',
                      created_at: '2023-08-01T09:15:35.979Z',
                      permissions: [
                        {
                          id: '21',
                          name: 'Archive',
                          code: 'system_conf.organizational_administration.products_procedures.products.archive',
                          created_at: '2023-08-01T09:15:35.986Z',
                        },
                        {
                          id: '20',
                          name: 'Write',
                          code: 'system_conf.organizational_administration.products_procedures.products.write',
                          created_at: '2023-08-01T09:15:35.984Z',
                        },
                        {
                          id: '19',
                          name: 'Read',
                          code: 'system_conf.organizational_administration.products_procedures.products.read',
                          created_at: '2023-08-01T09:15:35.981Z',
                        },
                      ],
                      child_modules: [],
                    },
                    {
                      id: '12',
                      code: 'procedures',
                      name: 'Procedures',
                      parent_id: '10',
                      created_at: '2023-08-01T09:15:35.989Z',
                      permissions: [
                        {
                          id: '24',
                          name: 'Archive',
                          code: 'system_conf.organizational_administration.products_procedures.procedures.archive',
                          created_at: '2023-08-01T09:15:35.996Z',
                        },
                        {
                          id: '23',
                          name: 'Write',
                          code: 'system_conf.organizational_administration.products_procedures.procedures.write',
                          created_at: '2023-08-01T09:15:35.993Z',
                        },
                        {
                          id: '22',
                          name: 'Read',
                          code: 'system_conf.organizational_administration.products_procedures.procedures.read',
                          created_at: '2023-08-01T09:15:35.991Z',
                        },
                      ],
                      child_modules: [],
                    },
                    {
                      id: '13',
                      code: 'procedure_types',
                      name: 'Procedure Types',
                      parent_id: '10',
                      created_at: '2023-08-01T09:15:36.000Z',
                      permissions: [
                        {
                          id: '27',
                          name: 'Archive',
                          code: 'system_conf.organizational_administration.products_procedures.procedure_types.archive',
                          created_at: '2023-08-01T09:15:36.007Z',
                        },
                        {
                          id: '26',
                          name: 'Write',
                          code: 'system_conf.organizational_administration.products_procedures.procedure_types.write',
                          created_at: '2023-08-01T09:15:36.005Z',
                        },
                        {
                          id: '25',
                          name: 'Read',
                          code: 'system_conf.organizational_administration.products_procedures.procedure_types.read',
                          created_at: '2023-08-01T09:15:36.002Z',
                        },
                      ],
                      child_modules: [],
                    },
                  ],
                },
                {
                  id: '14',
                  code: 'resources',
                  name: 'Resources',
                  parent_id: '1',
                  created_at: '2023-08-01T09:15:36.009Z',
                  permissions: [],
                  child_modules: [],
                },
              ],
            },
          },
        ],
      },
    };

    it('should get all permissions', async () => {
      jest
        .spyOn(rolePermissionsService, 'findAll')
        .mockResolvedValue(permissions);
      const result = await rolePermissionscontroller.findAll(permisionSearch);
      expect(result).toEqual(permissions);
      expect(rolePermissionsService.findAll).toHaveBeenCalledWith(
        permisionSearch
      );
    });
  });
  describe('createRole', () => {
    const createRole = {
      name: 'Admin role',
      description: 'Admin Role',
      permissions: [1, 2, 3],
      is_active: true,
      created_by: BigInt(1),
      forbidUnknownValues: true as const,
    };

    const role: any = {
      status: 'success',
      response: '',
      status_code: 201,
      data: {
        name: 'Admin role',
        description: 'Admin Role',
        created_by: 1,
        is_active: true,
        id: 26,
        created_at: new Date(),
      },
    };

    it('should create role', async () => {
      const req: any = {
        user: {
          id: 5,
          tenant: {
            id: 1,
          },
        },
      };
      jest.spyOn(rolePermissionsService, 'create').mockResolvedValue(role);
      const result = await rolePermissionscontroller.create(createRole, req);
      expect(result).toEqual(role);
      expect(rolePermissionsService.create).toHaveBeenCalledWith(
        createRole,
        req.user
      );
    });
  });

  describe('list Of roles', () => {
    const roleSearch = {
      page: 1,
      limit: 2,
    };
    const permissions: any = {
      status: 'success',
      respons: 'Roles Fetched Succesfuly',
      code: 200,
      count: 5,
      data: [
        {
          id: 4,
          name: 'staff two',
          permission: {
            application: [
              {
                name: 'System Configuration',
                modules: {
                  id: '1',
                  code: 'organizational_administration',
                  name: 'Organizational Administration',
                  parent_id: null,
                  created_at: '2023-07-24T15:47:07.732Z',
                  permissions: [],
                  child_modules: [
                    {
                      id: '2',
                      code: 'hierarchy',
                      name: 'Hierarchy',
                      parent_id: '1',
                      created_at: '2023-07-24T15:47:07.735Z',
                      permissions: [],
                      child_modules: [
                        {
                          id: '3',
                          code: 'organizational_levels',
                          name: 'Organizational Levels',
                          parent_id: '2',
                          created_at: '2023-07-24T15:47:07.736Z',
                          permissions: [
                            {
                              id: '1',
                              name: 'Read',
                              code: 'system_conf.organizational_administration.hierarchy.organizational_levels.read',
                              created_at: '2023-07-24T15:47:07.738Z',
                            },
                          ],
                          child_modules: [],
                        },
                        {
                          id: '4',
                          code: 'business_units',
                          name: 'Business Units',
                          parent_id: '2',
                          created_at: '2023-07-24T15:47:07.748Z',
                          permissions: [
                            {
                              id: '4',
                              name: 'Read',
                              code: 'system_conf.organizational_administration.hierarchy.business_units.read',
                              created_at: '2023-07-24T15:47:07.749Z',
                            },
                          ],
                          child_modules: [],
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          id: '3',
          name: 'staff one',
          permission: {
            application: [],
          },
        },
      ],
    };

    const loggedInUser = {
      id: '2',
      first_name: 'John',
      last_name: 'Cannon',
      keycloak_username: 'john.cannon@cooperativecomputing.com',
      unique_identifier: null,
      email: 'john.cannon@cooperativecomputing.com',
      date_of_birth: null,
      gender: null,
      home_phone_number: null,
      work_phone_number: null,
      work_phone_extension: null,
      address_line_1: null,
      address_line_2: null,
      zip_code: null,
      city: null,
      state: null,
      is_archived: false,
      is_active: false,
      is_super_admin: false,
      mobile_number: null,
      is_manager: false,
      override: false,
      adjust_appointment_slots: false,
      resource_sharing: false,
      edit_locked_fields: false,
      account_state: true,
      created_at: '2023-10-26T20:21:30.281Z',
      deleted_at: null,
      tenant: {
        id: '4',
        tenant_name: 'Platform Admin Dev',
        tenant_domain: 'http://platform-admin-dev.degree37.io',
        admin_domain: 'http://platform-admin-dev.degree37.io',
        email: 'john.cannon@cooperativecomputing.com',
        tenant_code: 'platform-admin-dev',
        phone_number: '(123) 456-7890',
        is_active: false,
        password:
          '$2b$10$U/cPjxBfpxl1a9jR8JquwO3MxIo5lbw3gGLdozDL/Pp/.9vezuo3y',
        tenant_timezone: 'string',
        allow_email: true,
        has_superadmin: false,
        created_at: '2023-10-26T21:05:50.684Z',
      },
      role: {
        id: '3',
        name: 'Platform',
        description: '',
        is_active: true,
        is_archived: false,
        is_recruiter: false,
        created_at: '2023-10-26T20:54:19.250Z',
      },
    };

    it('should get all permissions', async () => {
      jest
        .spyOn(rolePermissionsService, 'findAllRoles')
        .mockResolvedValue(permissions);
      const result = await rolePermissionscontroller.findAllRoles(
        roleSearch,
        loggedInUser
      );
      expect(result).toEqual(permissions);
    });
  });

  describe('Get specific role', () => {
    const permissions: any = {
      status: 'success',
      response: 'Role Found Successfully',
      status_code: 200,
      data: {
        id: '1',
        name: 'Recruiter',
        permission: {
          application: [
            {
              name: 'System Configuration',
              modules: {
                id: '1',
                code: 'organizational_administration',
                name: 'Organizational Administration',
                parent_id: null,
                created_at: '2023-07-25T11:50:05.828Z',
                permissions: [],
                child_modules: [
                  {
                    id: '2',
                    code: 'hierarchy',
                    name: 'Hierarchy',
                    parent_id: '1',
                    created_at: '2023-07-25T11:50:05.834Z',
                    permissions: [],
                    child_modules: [
                      {
                        id: '4',
                        code: 'business_units',
                        name: 'Business Units',
                        parent_id: '2',
                        created_at: '2023-07-25T11:50:05.858Z',
                        permissions: [
                          {
                            id: '4',
                            name: 'Read',
                            code: 'system_conf.organizational_administration.hierarchy.business_units.read',
                            created_at: '2023-07-25T11:50:05.863Z',
                          },
                        ],
                        child_modules: [],
                      },
                      {
                        id: '3',
                        code: 'organizational_levels',
                        name: 'Organizational Levels',
                        parent_id: '2',
                        created_at: '2023-07-25T11:50:05.838Z',
                        permissions: [
                          {
                            id: '1',
                            name: 'Read',
                            code: 'system_conf.organizational_administration.hierarchy.organizational_levels.read',
                            created_at: '2023-07-25T11:50:05.842Z',
                          },
                        ],
                        child_modules: [],
                      },
                    ],
                  },
                  {
                    id: '5',
                    code: 'goals',
                    name: 'Goals',
                    parent_id: '1',
                    created_at: '2023-07-25T11:50:05.875Z',
                    permissions: [
                      {
                        id: '5',
                        name: 'Write',
                        code: 'system_conf.organizational_administration.hierarchy.business_units.write',
                        created_at: '2023-07-25T11:50:05.868Z',
                      },
                    ],
                    child_modules: [],
                  },
                ],
              },
            },
            {
              name: 'CRM',
              modules: {
                id: '5',
                code: 'goals',
                name: 'Goals',
                parent_id: '1',
                created_at: '2023-07-25T11:50:05.875Z',
                permissions: [
                  {
                    id: '5',
                    name: 'Write',
                    code: 'system_conf.organizational_administration.hierarchy.business_units.write',
                    created_at: '2023-07-25T11:50:05.868Z',
                  },
                ],
                child_modules: [],
              },
            },
          ],
        },
        created_at: 'Jul 25, 2023, 04:50 PM',
      },
    };

    it('should get the permissions of one role', async () => {
      jest
        .spyOn(rolePermissionsService, 'findOneRole')
        .mockResolvedValue(permissions);
      const result = await rolePermissionscontroller.findOneRole('1');
      expect(result).toEqual(permissions);
      expect(rolePermissionsService.findOneRole).toHaveBeenCalledWith('1');
    });
  });

  describe('archiveRole', () => {
    it('should archive role if role is found', async () => {
      const id = 1;
      const archiveRoleInterface: ArchiveRoleInterface = {
        is_archived: true,
      };

      const response: any = {
        response: 'Role archived successfully',
        status: 'success',
        code: 200,
        data: null,
      };

      jest
        .spyOn(rolePermissionsService, 'archiveRole')
        .mockResolvedValue(response);

      const result = await rolePermissionscontroller.archiveRole(
        id,
        archiveRoleInterface
      );

      expect(result).toEqual(response);
      expect(rolePermissionsService.archiveRole).toHaveBeenCalledWith(
        id,
        archiveRoleInterface
      );
    });

    it('should unarchive role if role is found', async () => {
      const id = 1;
      const archiveRoleInterface: ArchiveRoleInterface = {
        is_archived: false,
      };

      const response: any = {
        response: 'Role unarchived successfully',
        status: 'success',
        code: 200,
        data: null,
      };

      jest
        .spyOn(rolePermissionsService, 'archiveRole')
        .mockResolvedValue(response);

      const result = await rolePermissionscontroller.archiveRole(
        id,
        archiveRoleInterface
      );

      expect(result).toEqual(response);
      expect(rolePermissionsService.archiveRole).toHaveBeenCalledWith(
        id,
        archiveRoleInterface
      );
    });

    it('should not do anything if role is not found', async () => {
      const id = 1;
      const archiveRoleInterface: ArchiveRoleInterface = {
        is_archived: true,
      };

      const response: any = {
        response: 'Role not found',
        status: 'success',
        code: 404,
        data: null,
      };

      jest
        .spyOn(rolePermissionsService, 'archiveRole')
        .mockResolvedValue(response);

      const result = await rolePermissionscontroller.archiveRole(
        id,
        archiveRoleInterface
      );

      expect(result).toEqual(response);
      expect(rolePermissionsService.archiveRole).toHaveBeenCalledWith(
        id,
        archiveRoleInterface
      );
    });
  });

  describe('updateRole', () => {
    it('should update the role and return the updated role', async () => {
      const id: any = 1;
      const updateRolePermissionDto: UpdateRolePermissionDto = {
        name: 'Updated Role',
        description: 'Updated Role Description',
        is_active: true,
        is_recruiter: true,
        created_by: BigInt(1),
        updated_by: BigInt(1),
        permissions: [1, 2],
      };

      const response: any = {
        status: 'success',
        response: 'Role updated successfully',
        status_code: HttpStatus.OK,
        data: {
          id: 1,
          name: 'Updated Role',
          description: 'Updated Role Description',
          is_active: true,
          is_archived: false,
          created_at: '2023-07-31T05:32:06.819Z',
          created_by: 1,
        },
      };

      jest
        .spyOn(rolePermissionsService, 'updateRole')
        .mockResolvedValue(response);

      const result = await rolePermissionscontroller.updateRole(
        id,
        updateRolePermissionDto
      );

      expect(result).toEqual(response);
      expect(rolePermissionsService.updateRole).toHaveBeenCalledWith(
        id,
        updateRolePermissionDto
      );
    });

    it('should throw an HttpException with 404 status code if role is not found', async () => {
      const id: any = 1000;
      const updateRolePermissionDto: UpdateRolePermissionDto = {
        name: 'Updated Role',
        description: 'Updated Role Description',
        is_active: true,
        is_recruiter: true,
        created_by: BigInt(1),
        updated_by: BigInt(1),
        permissions: [1, 2],
      };

      const response: any = {
        status: 'error',
        response: 'Role not found.',
        status_code: HttpStatus.NOT_FOUND,
        data: null,
      };

      jest
        .spyOn(rolePermissionsService, 'updateRole')
        .mockResolvedValue(response);
      const result = await rolePermissionscontroller.updateRole(
        id,
        updateRolePermissionDto
      );
      expect(result).toEqual(response);
      expect(rolePermissionsService.updateRole).toHaveBeenCalledWith(
        id,
        updateRolePermissionDto
      );
    });

    it('should throw an HttpException with 404 status code if user is not found', async () => {
      const id: any = 1;
      const updateRolePermissionDto: UpdateRolePermissionDto = {
        name: 'Updated Role',
        description: 'Updated Role Description',
        is_active: true,
        is_recruiter: true,
        created_by: BigInt(999),
        updated_by: BigInt(999),
        permissions: [1, 2],
      };

      const response: any = {
        status: 'error',
        response: 'User not found.',
        status_code: HttpStatus.NOT_FOUND,
        data: null,
      };

      jest
        .spyOn(rolePermissionsService, 'updateRole')
        .mockResolvedValue(response);

      const result = await rolePermissionscontroller.updateRole(
        id,
        updateRolePermissionDto
      );
      expect(result).toEqual(response);
      expect(rolePermissionsService.updateRole).toHaveBeenCalledWith(
        id,
        updateRolePermissionDto
      );
    });

    it('should throw an HttpException with 404 status code if some permissions are not found', async () => {
      const id: any = 1;
      const updateRolePermissionDto: UpdateRolePermissionDto = {
        name: 'Updated Role',
        description: 'Updated Role Description',
        is_active: true,
        is_recruiter: true,
        created_by: BigInt(1),
        updated_by: BigInt(1),
        permissions: [1, 999],
      };

      const response: any = {
        status: 'error',
        response: 'Some permissions not found.',
        status_code: HttpStatus.NOT_FOUND,
        data: null,
      };

      jest
        .spyOn(rolePermissionsService, 'updateRole')
        .mockResolvedValue(response);
      const result = await rolePermissionscontroller.updateRole(
        id,
        updateRolePermissionDto
      );
      expect(result).toEqual(response);
      expect(rolePermissionsService.updateRole).toHaveBeenCalledWith(
        id,
        updateRolePermissionDto
      );
    });
  });
});
