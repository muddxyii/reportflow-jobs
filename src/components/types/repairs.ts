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

export interface ReliefValveRepairs {
    cleaned: boolean;
    rubberKit: boolean;
    discHolder: boolean;
    spring: boolean;
    guide: boolean;
    seat: boolean;
    other: boolean;
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

export interface Repairs {
    checkValve1Repairs: CheckValveRepairs;
    checkValve2Repairs: CheckValveRepairs;
    reliefValveRepairs: ReliefValveRepairs;
    vacuumBreakerRepairs: VacuumBreakerRepairs;
    testerProfile: TesterProfile;
}