package com.vanilladream.backend.character;

import java.util.List;

public enum JobType {
    DESIGNER(List.of(StatType.CREATIVITY, StatType.PATTERN_SENSE, StatType.COLOR_SENSE)),
    MD(List.of(StatType.MERCHANDISING, StatType.ANALYSIS, StatType.COMMUNICATION)),
    MODEL(List.of(StatType.POSE, StatType.WALKING, StatType.EXPRESSION));

    private final List<StatType> statTypes;

    JobType(List<StatType> statTypes) {
        this.statTypes = statTypes;
    }

    public List<StatType> getStatTypes() {
        return statTypes;
    }
}
