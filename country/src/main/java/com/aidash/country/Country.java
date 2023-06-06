package com.aidash.country;

import org.postgis.Geometry;

import java.util.Objects;

public class Country {
    private Long id;

    private Geometry geometry;

    public Country() {
    }

    public Country(Long id, Geometry geometry) {
        this.id = id;
        this.geometry = geometry;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setGeometry(Geometry geometry) {
        this.geometry = geometry;
    }

    public Geometry getGeometry() {
        return geometry;
    }

    public Long getId() {
        return id;
    }
}