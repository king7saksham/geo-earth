package com.aidash.country;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CountryDataService {
    @Autowired
    private CountryRepository countryRepository;


    public CountryDataService() {

    }

    public JSONObject getCountryData(String id) {
        return countryRepository.getCountry(id);
    }
}