package com.abi.scamshield;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scan")
@CrossOrigin(origins = "*")
public class ScamController {

    @Autowired
    private ScamDetectorService detectorService;

    @Autowired
    private ScamRepository scamRepository;

    @PostMapping
    public ScamReport analyzeOffer(@RequestBody OfferRequest request) {
        ScamReport report = detectorService.analyze(request.getOfferText());
        report.setCompanyName(request.getCompanyName());
        return scamRepository.save(report);
    }
    @PostMapping("/upload")
    public ScamReport analyzeUploadedPdf(@RequestParam("file") org.springframework.web.multipart.MultipartFile file,
                                         @RequestParam(value = "companyName", required = false) String companyName) throws Exception {

        org.apache.pdfbox.pdmodel.PDDocument document = org.apache.pdfbox.pdmodel.PDDocument.load(file.getInputStream());
        org.apache.pdfbox.text.PDFTextStripper stripper = new org.apache.pdfbox.text.PDFTextStripper();
        String extractedText = stripper.getText(document);
        document.close();

        ScamReport report = detectorService.analyze(extractedText);
        report.setCompanyName(companyName);
        return scamRepository.save(report);
    }

    @GetMapping("/history")
    public List<ScamReport> getHistory() {
        return scamRepository.findAll();
    }

    @GetMapping("/company/{name}")
    public Map<String, Object> getCompanyReputation(@PathVariable String name) {
        List<ScamReport> matches = scamRepository.findByCompanyNameIgnoreCase(name);

        if (matches.isEmpty()) {
            return Map.of(
                    "companyName", name,
                    "totalScans", 0,
                    "message", "No scans found for this company yet."
            );
        }

        double avgScore = matches.stream().mapToInt(ScamReport::getRiskScore).average().orElse(0);
        long highRiskCount = matches.stream().filter(r -> r.getRiskLevel().equals("High Risk")).count();

        String overallVerdict;
        if (avgScore >= 50) overallVerdict = "High Risk";
        else if (avgScore >= 20) overallVerdict = "Suspicious";
        else overallVerdict = "Low Risk";

        return Map.of(
                "companyName", name,
                "totalScans", matches.size(),
                "averageScore", Math.round(avgScore),
                "highRiskReports", highRiskCount,
                "overallVerdict", overallVerdict
        );
    }
}