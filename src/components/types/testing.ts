import {CheckValve, ReliefValve, VacuumBreaker} from "@/components/types/test-components";

export interface TesterProfile {
    name: string;
    certNo: string;
    gaugeKit: string;
    date: string;
}

export const TesterProfile = {
    empty: (): TesterProfile => ({
        name: '',
        certNo: '',
        gaugeKit: '',
        date: ''
    }),
};


export interface Test {
    linePressure: string;
    checkValve1: CheckValve;
    checkValve2: CheckValve;
    reliefValve: ReliefValve;
    vacuumBreaker: VacuumBreaker;
    testerProfile: TesterProfile;
}

export const Test = {
    empty: (): Test => ({
        linePressure: '',
        checkValve1: CheckValve.empty(),
        checkValve2: CheckValve.empty(),
        reliefValve: ReliefValve.empty(),
        vacuumBreaker: VacuumBreaker.empty(),
        testerProfile: TesterProfile.empty()
    }),
    initialTextFields(): string[] {
        return ['DateFailed', 'LinePressure', 'InitialCT1', 'InitialCT2',
            'InitialPSIRV', 'InitialAirInlet', 'InitialCk1PVB'];
    },
    initialDropdownFields(): string[] {
        return ['InitialTester', 'InitialTesterNo', 'InitialTestKitSerial'];
    },
    initialCheckboxFields(): string[] {
        return ['InitialCTBox', 'InitialCT1Leaked', 'InitialCT2Box', 'InitialCT2Leaked',
            'InitialRVDidNotOpen', 'InitialAirInletLeaked', 'InitialCkPVBLDidNotOpen',
            'InitialCkPVBLeaked'];
    },
};
