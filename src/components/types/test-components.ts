export interface CheckValve {
    value: string;
    closedTight: boolean;
}

export interface ReliefValve {
    value: string;
    opened: boolean;
}

export interface AirInlet {
    value: string;
    leaked: boolean;
    opened: boolean;
}

export interface Check {
    value: string;
    leaked: boolean;
}

export interface VacuumBreaker {
    backPressure: boolean;
    airInlet: AirInlet;
    check: Check;
}