package com.myapp.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.jdbi.v3.core.Jdbi;

public final class JdbiUtil {

    private static Jdbi jdbi;

    private JdbiUtil() {
        // Prevent instantiation
    }
    static {

        try {

            Properties props =
                new Properties();

            InputStream input =
                JdbiUtil.class
                    .getClassLoader()
                    .getResourceAsStream(
                        "db.properties"
                    );

            if (input == null) {

                throw new RuntimeException(
                    "Could not find db.properties"
                );
            }

            props.load(input);

            String url =
                props.getProperty(
                    "db.url"
                );

            String user =
                props.getProperty(
                    "db.user"
                );

            String password =
                props.getProperty(
                    "db.password"
                );

            Class.forName(
                "com.mysql.cj.jdbc.Driver"
            );

            jdbi =
                Jdbi.create(
                    url,
                    user,
                    password
                );

            System.out.println(
                "TrackIt database connection initialised."
            );

        } catch (
            IOException |
            ClassNotFoundException e
        ) {

            throw new RuntimeException(
                "Failed to initialise JDBI",
                e
            );
        }
    }

    public static Jdbi getJdbi() {

        return jdbi;
    }
}
