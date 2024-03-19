import { SeederEnum } from '../enums/seeder.enum';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class SeedDto {
  @IsNotEmpty({ message: 'Seeder Type is required' })
  @IsEnum(SeederEnum)
  type: SeederEnum;
}

// Create interfaces/classes to represent the payload structure
interface Permission {
  name: string;
  code: string;
}

interface Module {
  name: string;
  code: string;
  child_modules?: Module[];
  permissions?: Permission[];
}

interface Application {
  name: string;
  modules: Module[];
}

// Assuming the DTO structure in the backend is similar to this payload structure
export class RoleDto {
  applications: Application[];
}
