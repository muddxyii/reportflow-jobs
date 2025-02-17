export interface CheckValve {
    value: string;
    closedTight: boolean;
}

export const CheckValve = {
    empty: (): CheckValve => ({
        value: '',
        closedTight: false
    })
};

export interface ReliefValve {
    value: string;
    opened: boolean;
}

export const ReliefValve = {
    empty: (): ReliefValve => ({
        value: '',
        opened: false
    })
};

export interface AirInlet {
    value: string;
    leaked: boolean;
    opened: boolean;
}

export const AirInlet = {
    empty: (): AirInlet => ({
        value: '',
        leaked: false,
        opened: false
    })
};

export interface Check {
    value: string;
    leaked: boolean;
}

export const Check = {
    empty: (): Check => ({
        value: '',
        leaked: false
    })
};

export interface VacuumBreaker {
    backPressure: boolean;
    airInlet: AirInlet;
    check: Check;
}

export const VacuumBreaker = {
    empty: (): VacuumBreaker => ({
        backPressure: false,
        airInlet: AirInlet.empty(),
        check: Check.empty()
    })
};
