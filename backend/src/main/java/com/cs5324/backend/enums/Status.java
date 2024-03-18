package com.cs5324.backend.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Status {
    @JsonProperty("online")
    ONLINE,
    @JsonProperty("do_not_disturb")
    DO_NOT_DISTURB,
    @JsonProperty("offline")
    OFFLINE
}
