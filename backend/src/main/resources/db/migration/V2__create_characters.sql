CREATE TABLE characters (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL,
    name VARCHAR(20) NOT NULL,
    skin_tone VARCHAR(30) NOT NULL,
    hair_style VARCHAR(30) NOT NULL,
    hair_color VARCHAR(30) NOT NULL,
    face_preset VARCHAR(30) NOT NULL,
    job VARCHAR(30),
    level INTEGER NOT NULL,
    exp INTEGER NOT NULL,
    promotion_tier VARCHAR(30) NOT NULL,
    beads INTEGER NOT NULL,
    current_location VARCHAR(30) NOT NULL,
    title VARCHAR(60) NOT NULL,
    last_active_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_characters_account FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE,
    CONSTRAINT uk_characters_account UNIQUE (account_id)
);

CREATE TABLE character_stats (
    id BIGSERIAL PRIMARY KEY,
    character_id BIGINT NOT NULL,
    stat_type VARCHAR(40) NOT NULL,
    stat_value INTEGER NOT NULL,
    CONSTRAINT fk_character_stats_character FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE,
    CONSTRAINT uk_character_stats_character_type UNIQUE (character_id, stat_type)
);
