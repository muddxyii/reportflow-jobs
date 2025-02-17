import {TesterProfile} from "@/components/types/testing";

export interface CheckValveRepairs {
    cleaned: boolean;
    checkDisc: boolean;
    discHolder: boolean;
    spring: boolean;
    guide: boolean;
    seat: boolean;
    other: boolean;
}

export const CheckValveRepairs = {
    empty: (): CheckValveRepairs => ({
        cleaned: false,
        checkDisc: false,
        discHolder: false,
        spring: false,
        guide: false,
        seat: false,
        other: false
    }),
    checkboxFields: (): string[] => [
        'Ck1Cleaned', 'Ck1CheckDisc', 'Ck1DiscHolder',
        'Ck1Spring', 'Ck1Guide', 'Ck1Seat', 'Ck1Other', 'Ck2Cleaned', 'Ck2CheckDisc', 'Ck2DiscHolder',
        'Ck2Spring', 'Ck2Guide', 'Ck2Seat', 'Ck2Other',
    ],
}

export interface ReliefValveRepairs {
    cleaned: boolean;
    rubberKit: boolean;
    discHolder: boolean;
    spring: boolean;
    guide: boolean;
    seat: boolean;
    other: boolean;
}

export const ReliefValveRepairs = {
    empty: (): ReliefValveRepairs => ({
        cleaned: false,
        rubberKit: false,
        discHolder: false,
        spring: false,
        guide: false,
        seat: false,
        other: false
    }),
    checkboxFields: (): string[] => [
        'RVCleaned', 'RVRubberKit', 'RVDiscHolder',
        'RVSpring', 'RVGuide', 'RVSeat', 'RVOther',
    ],
}

export interface VacuumBreakerRepairs {
    cleaned: boolean;
    rubberKit: boolean;
    discHolder: boolean;
    spring: boolean;
    guide: boolean;
    seat: boolean;
    other: boolean;
}

export const VacuumBreakerRepairs = {
    empty: (): VacuumBreakerRepairs => ({
        cleaned: false,
        rubberKit: false,
        discHolder: false,
        spring: false,
        guide: false,
        seat: false,
        other: false
    }),
    checkboxFields: (): string[] => [
        'PVBCleaned', 'PVBRubberKit', 'PVBDiscHolder',
        'PVBSpring', 'PVBGuide', 'PVBSeat', 'PVBOther'
    ],
}

export interface Repairs {
    checkValve1Repairs: CheckValveRepairs;
    checkValve2Repairs: CheckValveRepairs;
    reliefValveRepairs: ReliefValveRepairs;
    vacuumBreakerRepairs: VacuumBreakerRepairs;
    testerProfile: TesterProfile;
}

export const Repairs = {
    empty: (): Repairs => ({
        checkValve1Repairs: CheckValveRepairs.empty(),
        checkValve2Repairs: CheckValveRepairs.empty(),
        reliefValveRepairs: ReliefValveRepairs.empty(),
        vacuumBreakerRepairs: VacuumBreakerRepairs.empty(),
        testerProfile: TesterProfile.empty(),
    }),
    textFields: (): string[] => ['DateRepaired'],
    checkboxFields: (): string[] => CheckValveRepairs.checkboxFields().concat(ReliefValveRepairs.checkboxFields()).concat(ReliefValveRepairs.checkboxFields()).concat(VacuumBreakerRepairs.checkboxFields()),
    dropdownFields: (): string[] => ['RepairedTester', 'RepairedTesterNo', 'RepairedTestKitSerial'],
}