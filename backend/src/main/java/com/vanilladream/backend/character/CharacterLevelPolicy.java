package com.vanilladream.backend.character;

public final class CharacterLevelPolicy {

    public static final int MAX_LEVEL = 10;
    private static final int BASE_EXP_TO_LEVEL = 100;
    private static final int LEVEL_STEP_INCREMENT = 50;

    private CharacterLevelPolicy() {
    }

    public static int resolveLevel(int totalExp) {
        int level = 1;

        while (level < MAX_LEVEL && totalExp >= requiredExpForLevel(level + 1)) {
            level++;
        }

        return level;
    }

    public static int requiredExpForLevel(int level) {
        if (level <= 1) {
            return 0;
        }

        int totalExp = 0;

        for (int currentLevel = 2; currentLevel <= level; currentLevel++) {
            totalExp += BASE_EXP_TO_LEVEL + ((currentLevel - 2) * LEVEL_STEP_INCREMENT);
        }

        return totalExp;
    }
}
