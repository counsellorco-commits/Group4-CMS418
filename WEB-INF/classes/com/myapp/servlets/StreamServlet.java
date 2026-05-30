package com.myapp.servlets;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/stream")
public class StreamServlet extends HttpServlet {

    private String FILE_PATH = getServletContext().getRealPath("/ecg_sample.txt");
    private static final int SAMPLING_RATE = 1000;
    private static final int CHUNK_MS = 200;
    private static final int SAMPLES_PER_CHUNK =(SAMPLING_RATE * CHUNK_MS) / 1000; // 200

    @Override
    protected void doGet(HttpServletRequest req,HttpServletResponse resp)
            throws IOException {
        resp.setContentType("text/event-stream");
        resp.setCharacterEncoding("UTF-8");
        resp.setHeader("Cache-Control", "no-cache");
        PrintWriter out = resp.getWriter();

        try (BufferedReader reader =new BufferedReader(new FileReader(FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().equals("# EndOfHeader")) {
                    break;
                }
            }

            long sampleIndex = 0;
            while (true) {
                StringBuilder json = new StringBuilder("[");
                int count = 0;

                while (count < SAMPLES_PER_CHUNK &&(line = reader.readLine()) != null) {
                    if (line.trim().isEmpty()) {
                        continue;
                    }

                    String[] cols = line.trim().split("\\s+");

                    /* 
                      OpenSignals columns:
                      nSeq I1 I2 O1 O2 A2
    
                      ECG value is last column (A2)
                     */
                    int ecgValue = Integer.parseInt(cols[5]);
                    long timestampMs =(sampleIndex * 1000)/ SAMPLING_RATE;

                    if (count > 0) {
                        json.append(",");
                    }
                    json.append("[")
                        .append(timestampMs)
                        .append(",")
                        .append(ecgValue)
                        .append("]");

                    sampleIndex++;
                    count++;
                }

                if (count == 0) {
                    break;
                }

                json.append("]");

                out.write("data: ");
                out.write(json.toString());
                out.write("\n\n");

                out.flush();

                //Last partial chunk                  
                if (count < SAMPLES_PER_CHUNK) {
                    break;
                }

                Thread.sleep(CHUNK_MS);
            }

            // Tell frontend stream is finished
            out.write("event: end\n");
            out.write("data: eof\n\n");
            out.flush();

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}