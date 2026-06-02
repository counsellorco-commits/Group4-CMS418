package com.myapp.servlets;

import com.myapp.utils.JdbiUtil;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jdbi.v3.core.Jdbi;

@WebServlet("/test-db")
public class TestConnectionServlet
        extends HttpServlet {

    @Override
    protected void doGet(
            HttpServletRequest req,
            HttpServletResponse resp)
            throws IOException {

        resp.setContentType(
                "text/plain");

        PrintWriter out =
                resp.getWriter();

        try {

            Jdbi jdbi =
                    JdbiUtil.getJdbi();

            String database =
                    jdbi.withHandle(
                            handle ->
                                    handle.createQuery(
                                            "SELECT DATABASE()")
                                            .mapTo(
                                                    String.class)
                                            .one()
                    );

            out.println(
                    "SUCCESS");
            out.println(
                    "Connected to database: "
                            + database);

        } catch (Exception e) {

            out.println(
                    "FAILED");

            out.println(
                    e.getMessage());

            e.printStackTrace();
        }
    }
}
