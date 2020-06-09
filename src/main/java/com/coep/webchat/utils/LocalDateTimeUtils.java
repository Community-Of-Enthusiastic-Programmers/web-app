package com.coep.webchat.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LocalDateTimeUtils {
    public static String formatTime(LocalDateTime dateTime) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        return dateTime.format(dateTimeFormatter);
    }

    public static String formatDate(LocalDateTime dateTime) {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        return dateTime.format(dateTimeFormatter);
    }
}
