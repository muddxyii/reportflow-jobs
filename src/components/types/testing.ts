import {CheckValve, ReliefValve, VacuumBreaker} from "@/components/types/test-components";

export interface TesterProfile {
    name: string;
    certNo: string;
    gaugeKit: string;
    date: string;
}

export interface Test {
    linePressure: string;
    checkValve1: CheckValve;
    checkValve2: CheckValve;
    reliefValve: ReliefValve;
    vacuumBreaker: VacuumBreaker;
    testerProfile: TesterProfile;
}