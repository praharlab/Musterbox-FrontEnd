import { environment } from 'src/environments/environment';
import { UserRole } from '../shared/auth.roles';

const adminRoot = environment.adminRoot;

export interface IMenuItem {
  id?: string;
  icon?: string;
  label: string;
  menu: string;
  to: string;
  newWindow?: boolean;
  subs?: IMenuItem[];
  roles?: UserRole[];
  formMasterID?: any;
}

const getMenu = () => {
  let data1;
  let data2: any = localStorage.getItem('usertype');

  if (data2 == 2) {
    const data: IMenuItem[] = [
      {
        icon: '',
        label: 'menu.dashboards',
        menu: 'VisitPurpose',
        to: `${adminRoot}/dashboards/default`,
      },
      {
        icon: '',
        label: 'Admin Menu',
        menu: 'Company',
        to: `${adminRoot}/superadminmenus`,
        // roles: [UserRole.Admin],
      },
    ];
    data1 = data;
  }
  if (data2 == 3) {
    const data: IMenuItem[] = [
      {
        icon: '',
        label: 'menu.dashboards',
        menu: 'VisitPurpose',
        to: `${adminRoot}/dashboards/default`,
      },
      {
        icon: '',
        label: 'Company',
        menu: 'Company',
        to: `${adminRoot}/masters/company_master`,
        // roles: [UserRole.Admin],
      },
    ];
    data1 = data;
  }

  if (data2 != 2 && data2 != 3) {
    const data: IMenuItem[] = [
      {
        icon: 'assets/menuIcons/homeIcon.svg',
        label: 'Home',
        menu: 'Home',
        to: `${adminRoot}/dashboards/analytics`,
      },
      {
        icon: 'assets/menuIcons/meIcon.svg',
        label: 'Me',
        menu: 'Me',
        to: `${adminRoot}/me`,
      },
      {
        icon: 'assets/menuIcons/taskIcon.svg',
        label: 'Task',
        menu: 'Task',
        to: `${adminRoot}/tasks`,
      },

      {
        icon: 'assets/menuIcons/masterIcon.svg',
        label: 'Master',
        menu: 'Master',
        to: `${adminRoot}/masters`,
      },

      {
        icon: 'assets/menuIcons/visitIcon.svg',
        label: 'Visit',
        menu: 'VisitMain',
        to: `${adminRoot}/visits`,
      },
      {
        icon: 'assets/menuIcons/myTeamIcon.svg',
        label: 'My Team',
        menu: 'MyTeam',
        to: `${adminRoot}/myteam`,
      },
      {
        icon: 'assets/menuIcons/financeIcon.svg',
        label: 'My Finances',
        menu: 'MyFinances',
        to: `${adminRoot}/finances`,
      },

      {
        icon: 'assets/menuIcons/orgIcon.svg',
        label: 'Org',
        menu: 'Org',
        to: `${adminRoot}/orgs`,
      },
      {
        icon: 'assets/menuIcons/attendanceIcon.svg',
        label: 'Attendance',
        menu: 'AttendanceMain',
        to: `${adminRoot}/attendances`,
      },
      {
        icon: 'assets/menuIcons/assetIcon.svg',
        label: 'Asset',
        menu: 'AssetMaster',
        to: `${adminRoot}/assets`,
      },
      {
        icon: 'assets/menuIcons/payrollIcon.svg',
        label: 'Payroll',
        menu: 'Payroll',
        to: `${adminRoot}/payrolls`,
      },
      {
        icon: 'assets/menuIcons/overtimeIcon.svg',
        label: 'Overtime',
        menu: 'Overtime',
        to: `${adminRoot}/overtimes`,
      },
      {
        icon: 'assets/menuIcons/preBoardingIcon.svg',
        label: 'Pre-Boarding',
        menu: 'PreBoarding',
        to: `${adminRoot}/preboardings`,
      },

      {
        icon: 'assets/menuIcons/offBoardingIcon.svg',
        label: 'Off-Boarding',
        menu: 'Offboarding',
        to: `${adminRoot}/offboardings`,
      },

      {
        icon: 'assets/menuIcons/reportIcon.svg',
        label: 'Report',
        menu: 'Report',
        to: `${adminRoot}/reports`,
      },
      {
        icon: 'assets/menuIcons/govtReportsIcon.svg',
        label: 'Govt. Report',
        menu: 'GovernmentReport',
        to: `${adminRoot}/govtreports`,
      },

      {
        icon: 'assets/menuIcons/gatepassIcon.svg',
        label: 'Gate Pass',
        menu: 'GatePass',
        to: `${adminRoot}/gatepasses`,
      },

      {
        icon: 'assets/menuIcons/skillsetsIcon.svg',
        label: 'Skillsets',
        menu: 'SkillSets',
        to: `${adminRoot}/skillsets`,
      },
      {
        icon: 'assets/menuIcons/helpIcon.svg',
        label: 'Help Desk',
        menu: 'HelpDesk',
        to: `${adminRoot}/tickets`,
      },
      {
        icon: 'assets/menuIcons/checklistIcon.svg',
        label: 'CheckList',
        menu: 'CheckList',
        to: `${adminRoot}/checklists`,
      },
      {
        icon: 'assets/menuIcons/pmsIcon.svg',
        label: 'PMS',
        menu: 'PMS',
        to: `${adminRoot}/pms`,
      },
      {
        icon: 'assets/menuIcons/utilityIcon.svg',
        label: 'Utility',
        menu: 'Utility',
        to: `${adminRoot}/utilitys`,
      },
      {
        icon: 'assets/menuIcons/moodTrackerIcon.svg',
        label: 'MoodTracker',
        menu: 'MoodTracker',
        to: `${adminRoot}/moodTrackers`,
      },
      {
        icon: 'assets/menuIcons/incomeTaxIcon.svg',
        label: 'Income Tax',
        menu: 'IncomeTax',
        to: `${adminRoot}/incometax`,
      },
      {
        icon: 'assets/menuIcons/empGatepassIcon.svg',
        label: 'Employee GatePass',
        menu: 'EmployeeGatepass',
        to: `${adminRoot}/employeegatepasses`,
      },

    ];
    data1 = data;

    return data1;
  }
}

export default getMenu;
