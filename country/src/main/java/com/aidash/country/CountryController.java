package com.aidash.country;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/country")
public class CountryController {
    @Autowired
    private CountryDataService countryDataService;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/getCountryData", produces = "application/JSON")
    public ResponseEntity<JSONObject> getCountryData(
            @RequestParam String id
    ) {
        return new ResponseEntity<>(this.countryDataService.getCountryData(id), HttpStatus.OK);
    }
}