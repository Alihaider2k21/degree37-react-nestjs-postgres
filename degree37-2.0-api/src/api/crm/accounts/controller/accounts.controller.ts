import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Request,
  Put,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AccountsService } from '../services/accounts.service';
import { AccountsDto } from '../dto/accounts.dto';
import { UserRequest } from '../../../../common/interface/request';
import {
  GetAccountsSearch,
  GetAllAccountsInterface,
  GetDrivesHistoryQuery,
} from '../interface/accounts.interface';
import {
  AccountContactsDto,
  CreateDriveAccountsDto,
} from '../dto/accounts-contact.dto';
import { AccountContactsService } from '../services/accounts-contacts.service';
import { AccountPreferencesService } from '../services/accounts-preferences.service';
import { AccountPreferencesDto } from '../dto/account-preferences.dto';
import { AccountAffiliationsService } from '../services/accounts-affiliations.service';
import { AccountAffiliationsDto } from '../dto/account-affiliations.dto';
import { GetAllAccountContactsInterface } from '../interface/account-contacts.interface';
import { GetAllAccountAffiliationsInterface } from '../interface/account-affiliations.interface';
import { PermissionGuard } from 'src/api/common/permission-based-access/permission.guard';
import { Permissions } from 'src/api/common/permission-based-access/permissions.decorator';
import { PermissionsEnum } from 'src/api/common/permission-based-access/permissions.enum';
import { AccountsBluePrintsService } from '../services/accounts-blueprints.service';
import { AccountDefaultBlueprintDto } from '../dto/account-default-blueprint.dto';
@ApiTags('Accounts')
@Controller('/accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly accountsContactService: AccountContactsService,
    private readonly accountsPreferenceService: AccountPreferencesService,
    private readonly accountsAffiliationService: AccountAffiliationsService,
    private readonly AccountsBluePrintsService: AccountsBluePrintsService
  ) {}

  @Get('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  // @UseGuards(PermissionGuard)
  // @Permissions(
  //   PermissionsEnum.CRM_ACCOUNTS_READ,
  //   PermissionsEnum.CRM_ACCOUNTS_WRITE
  // )
  async findAll(
    @Request() req: UserRequest,
    @Query() GetAllAccountsInterface: GetAllAccountsInterface
  ) {
    GetAllAccountsInterface.tenant_id = req.user.tenant.id;
    return this.accountsService.findAll(GetAllAccountsInterface);
  }

  @Get('/recruiter')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async findAllAccountsRecruiter() {
    return this.accountsService.findAllAccountsRecruiter();
  }

  @Get('/recruiter/:id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  async findAllAccountsRecruiterByRecruiterId(
    @Param('id') id: any,
    @Query() getAccountsSearch: GetAccountsSearch,
    @Request() req: UserRequest
  ) {
    return this.accountsService.findAllAccountsRecruiterByRecruiterId(
      id,
      getAccountsSearch,
      req?.user
    );
  }

  @Post('')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_ACCOUNTS_WRITE)
  async create(
    @Request() req: UserRequest,
    @Body() createAccountDto: AccountsDto
  ) {
    return this.accountsService.create(req.user, createAccountDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_ACCOUNTS_WRITE)
  async update(
    @Request() req: UserRequest,
    @Param('id') id: any,
    @Body() updateAccountDto: AccountsDto
  ) {
    return this.accountsService.update(req.user, id, updateAccountDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @UseGuards(PermissionGuard)
  @Permissions(PermissionsEnum.CRM_ACCOUNTS_ARCHIVE)
  async deleteAccount(@Request() req: UserRequest, @Param('id') id: any) {
    return this.accountsService.deleteAccount(req.user, id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions(
    PermissionsEnum.CRM_ACCOUNTS_WRITE,
    PermissionsEnum.CRM_ACCOUNTS_READ
  )
  async findOne(@Param('id') id: any) {
    return this.accountsService.findOne(id);
  }

  @Get(':id/account-contacts')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  async findAllContacts(
    @Param('id') id: any,
    @Query() getAllAccountContactsInterface: GetAllAccountContactsInterface
  ) {
    return this.accountsContactService.findAllContacts(
      id,
      getAllAccountContactsInterface
    );
  }

  @Post(':id/account-contacts')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async createContacts(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Body() createContactsDto: AccountContactsDto
  ) {
    return this.accountsContactService.createContacts(
      id,
      req.user,
      createContactsDto
    );
  }

  @Put('account-contacts/:id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async updateContacts(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Body() createContactsDto: AccountContactsDto
  ) {
    return this.accountsContactService.updateContacts(
      id,
      req.user,
      createContactsDto
    );
  }

  @Get(':id/account-preferences')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  async findAllPreferences(@Param('id') id: any) {
    return this.accountsPreferenceService.findAllPreferences(id);
  }

  @Post(':id/account-preferences')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async createPreferences(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Body() createPreferencesDto: AccountPreferencesDto
  ) {
    return this.accountsPreferenceService.createPreferences(
      id,
      req.user,
      createPreferencesDto
    );
  }
  @Put(':id/account-preferences/:preference_id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'preference_id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async archivePreferences(
    @Param('preference_id') preference_id: any,
    @Request() req: UserRequest
  ) {
    return this.accountsPreferenceService.archivePreferences(
      preference_id,
      req.user
    );
  }

  @Get(':id/account-affiliations')
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.OK)
  async findAllAffiliations(
    @Param('id') id: any,
    @Query()
    getAllAccountAffiliationsInterface: GetAllAccountAffiliationsInterface
  ) {
    return this.accountsAffiliationService.findAllAffiliations(
      id,
      getAllAccountAffiliationsInterface
    );
  }

  @Post(':id/account-affiliations')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async createAffiliations(
    @Param('id') id: any,
    @Request() req: UserRequest,
    @Body() createAffiliationsDto: AccountAffiliationsDto
  ) {
    return this.accountsAffiliationService.createAffiliations(
      id,
      req.user,
      createAffiliationsDto
    );
  }
  @Put(':id/account-affiliations/:affiliation_id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'affiliation_id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async updateAffiliation(
    @Param('affiliation_id') affiliation_id: any,
    @Request() req: UserRequest,
    @Body() affiliationsDto: AccountAffiliationsDto
  ) {
    return this.accountsAffiliationService.updateAffiliation(
      affiliation_id,
      req.user,
      affiliationsDto
    );
  }

  @Put(':account_id/marketing-material/:drive_id')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'account_id', required: true })
  @ApiParam({ name: 'drive_id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async archiveMarketingMaterial(
    @Param('account_id') account_id: any,
    @Param('drive_id') drive_id: any,
    @Request() req: UserRequest
  ) {
    return this.AccountsBluePrintsService.archiveAccountInDrive(
      account_id,
      drive_id,
      req.user
    );
  }
  @Get('upsert/seed-data')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getAccountSeedData(
    @Request() req: UserRequest,
    @Query() queryParams: GetAllAccountsInterface
  ) {
    queryParams.tenant_id = req.user.tenant.id;
    return this.accountsService.getAccountSeedData(req.user, queryParams);
  }

  @Get('/:id/drives-history')
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async driveHistory(
    @Param('id') id: any,
    @Query() params: GetDrivesHistoryQuery,
    @Request() req: UserRequest
  ) {
    return this.accountsService.driveHistory(id, params, req?.user);
  }

  @Get('/:id/drives-history/kpi')
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async driveHistoryKPI(@Param('id') id: any) {
    return this.accountsService.driveHistoryKPI(id);
  }

  @Get('/:id/drives-history/detail/:driveId')
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'driveId', required: true })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async driveHistoryDetail(
    @Param('id') id: any,
    @Param('driveId') driveId: any,
    @Query() params: GetDrivesHistoryQuery,
    @Request() req: UserRequest
  ) {
    return this.accountsService.driveHistoryDetail(
      id,
      params,
      req?.user,
      driveId
    );
  }

  @Get('bluePrints/:id/get')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  async getAccountDrivesBluePrints(
    @Request() req: UserRequest,
    @Param('id') id: any,
    @Query() queryParams: GetAllAccountsInterface
  ) {
    console.log({ id });
    return this.AccountsBluePrintsService.findAllWithFilters(
      req.user,
      id,
      queryParams
    );
  }

  @Get('bluePrintsDefault/:id/get')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  async getAccountDrivesBluePrintDefault(
    @Request() req: UserRequest,
    @Param('id') id: any
  ) {
    console.log({ id });
    return this.AccountsBluePrintsService.findDefault(req.user, id);
  }
  @Get('drives/marketing-details')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async getAccountDrivesBluePrintsMarketingDetails(
    @Request() req: UserRequest,
    @Query()
    queryParams: { account_id: string; bluePrint_id: string; driveId: string }
  ) {
    return this.AccountsBluePrintsService.accountsBluePrintsMarkitingDetails(
      req.user,
      queryParams
    );
  }

  @Post('/drives')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async addAccountsIntoDrive(
    @Request() req: UserRequest,
    @Body() body: CreateDriveAccountsDto[]
  ) {
    return this.AccountsBluePrintsService.addNewAccountsIntoDrive(
      req.user,
      body
    );
  }

  @Post('blueprint/default')
  @UsePipes(new ValidationPipe())
  @ApiParam({ name: 'id', required: true })
  @HttpCode(HttpStatus.CREATED)
  async makeDefaultBlueprint(
    @Request() req: UserRequest,
    @Body() body: AccountDefaultBlueprintDto
  ) {
    body.tenant_id = req?.user?.tenant;
    body.created_by = req?.user;
    return this.accountsService.makeDefaultBlueprint(body);
  }
}
