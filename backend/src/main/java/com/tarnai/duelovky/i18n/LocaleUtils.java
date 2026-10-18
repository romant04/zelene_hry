package com.tarnai.duelovky.i18n;

public final class LocaleUtils {
    public static final String DEFAULT_LOCALE = "cs";
    public static final String ENGLISH = "en";

    private LocaleUtils() {
    }

    public static String resolve(String acceptLanguage) {
        if (acceptLanguage == null || acceptLanguage.isBlank()) {
            return DEFAULT_LOCALE;
        }

        String primary = acceptLanguage.split(",")[0].trim().toLowerCase();
        if (primary.startsWith("en")) {
            return ENGLISH;
        }
        return DEFAULT_LOCALE;
    }
}
