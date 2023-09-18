create Table room(
    id SERIAL PRIMARY KEY,
    number SMALLINT NOT NULL,
    type VARCHAR(20)
);

create Table client(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    vip_service_id SMALLINT
);

create Table booking(
    id SERIAL PRIMARY KEY,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    room_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    is_vip_client BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (room_id) REFERENCES room (id),
    FOREIGN KEY (client_id) REFERENCES client (id)
);