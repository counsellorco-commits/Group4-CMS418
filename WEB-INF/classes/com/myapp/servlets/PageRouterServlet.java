package com.myapp.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(urlPatterns = {
    "/login",
    "/newpatient",
    "/findpatient",
    "/monitor"
})
public class PageRouterServlet extends HttpServlet {

    @Override
    protected void doGet(
            HttpServletRequest req,
            HttpServletResponse resp)
            throws ServletException, IOException {

        String path = req.getServletPath();

        switch (path) {

            case "/login":
                req.getRequestDispatcher("/login.html")
                   .forward(req, resp);
                break;

            case "/newpatient":
                req.getRequestDispatcher("/new-patient.html")
                   .forward(req, resp);
                break;

            case "/findpatient":
                req.getRequestDispatcher("/find-patient.html")
                   .forward(req, resp);
                break;

            case "/monitor":
                req.getRequestDispatcher("/ecg-monitor.html")
                   .forward(req, resp);
                break;

            default:
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}