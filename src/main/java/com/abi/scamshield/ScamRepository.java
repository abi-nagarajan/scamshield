package com.abi.scamshield;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScamRepository extends JpaRepository<ScamReport, Long> {
    List<ScamReport> findByCompanyNameIgnoreCase(String companyName);
}