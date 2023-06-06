package com.aidash.country;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class CountryRepository extends BaseAdapter {
    public JSONObject getCountry(String id) {
        String field = convert(id);

        String sql = "SELECT ST_AsGeoJSON(geometry) geometry, country name, ST_Area(geometry) area, population_population population, density_density density, currency_currency_name currency, capitol_city capital, iso id FROM country_data" + (field.equals("('WORLD')") ? "" : " WHERE iso IN " + field) + ";";

        List<JSONObject> regions = new ArrayList<>();
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
        JSONParser parser = new JSONParser();

        for (Map<String, Object> row : rows) {
            try {
                JSONObject geometryJson = new JSONObject();
                JSONObject properties = new JSONObject();

                geometryJson.put("type", "Feature");
                geometryJson.put("id", row.get("id"));
                geometryJson.put("geometry", parser.parse((String) row.get("geometry")));

                properties.put("name", row.get("name"));
                properties.put("area", row.get("area"));
                properties.put("population", row.get("population"));
                properties.put("population density", row.get("density"));
                properties.put("capital", row.get("capital"));
                geometryJson.put("properties", properties);

                regions.add(geometryJson);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        JSONObject geoJson = new JSONObject();
        geoJson.put("type", "FeatureCollection");
        geoJson.put("features", regions);

        return geoJson;
    }

    private String convert (String id) {
        String[] ids = id.split(",");
        int idLength = ids.length;

        StringBuilder sb = new StringBuilder();
        sb.append("(");

        for (int i = 0; i < idLength; i++) {
            ids[i] = ids[i].trim().toUpperCase();
            sb.append("'").append(ids[i]).append("'");

            if (i < idLength - 1) sb.append(", ");
        }

        sb.append(")");

        return sb.toString();
    }
}
