package com.abi.scamshield;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class ScamDetectorService {

    public ScamReport analyze(String offerText) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        String text = offerText.toLowerCase();

        // Rule 1: Payment/deposit requests
        if (text.contains("pay") && (text.contains("fee") || text.contains("deposit") || text.contains("training kit") || text.contains("registration"))) {
            score += 30;
            reasons.add("Requests payment or deposit before hiring — legitimate employers never ask for money upfront.");
        }

        // Rule 2: Urgency/pressure language
        String[] urgencyWords = {"urgent", "act now", "limited seats", "expires in", "hurry", "immediately", "within 24 hours"};
        for (String word : urgencyWords) {
            if (text.contains(word)) {
                score += 20;
                reasons.add("Uses urgency/pressure language (\"" + word + "\") to rush your decision.");
                break;
            }
        }

        // Rule 3: Unrealistic salary
        if (text.contains("no experience") && (text.contains("₹") || text.contains("rs.") || text.contains("salary")) &&
                (text.contains("lakh") || text.contains("50,000") || text.contains("80,000") || text.contains("100,000"))) {
            score += 25;
            reasons.add("Promises a high salary with no experience required — a common scam pattern.");
        }

        // Rule 4: Suspicious free email domains for a "company"
        String[] freeEmailDomains = {"@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com"};
        for (String domain : freeEmailDomains) {
            if (text.contains(domain)) {
                score += 15;
                reasons.add("Uses a free email domain (" + domain + ") instead of an official company domain.");
                break;
            }
        }

        // Rule 5: Suspicious/shortened links
        String[] suspiciousLinks = {"bit.ly", "tinyurl", "click here", "wa.me"};
        for (String link : suspiciousLinks) {
            if (text.contains(link)) {
                score += 20;
                reasons.add("Contains a suspicious or shortened link (" + link + ") instead of an official company URL.");
                break;
            }
        }

        // Rule 6: Vague company info
        if (!text.contains("website") && !text.contains("www.") && !text.contains(".com")) {
            score += 10;
            reasons.add("No verifiable company website or domain mentioned.");
        }

        // Determine risk level
        String level;
        if (score >= 50) {
            level = "High Risk";
        } else if (score >= 20) {
            level = "Suspicious";
        } else {
            level = "Low Risk";
        }

        if (reasons.isEmpty()) {
            reasons.add("No major red flags detected based on current rules.");
        }

        ScamReport report = new ScamReport();
        report.setOfferText(offerText);
        report.setRiskScore(score);
        report.setRiskLevel(level);
        report.setReasons(String.join(" | ", reasons));

        return report;
    }
}