package com.abi.scamshield;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class ScamReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 3000)
    private String offerText;

    private int riskScore;
    private String riskLevel;
    private String companyName;
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    @Column(length = 2000)
    private String reasons;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOfferText() { return offerText; }
    public void setOfferText(String offerText) { this.offerText = offerText; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getReasons() { return reasons; }
    public void setReasons(String reasons) { this.reasons = reasons; }
}