package com.aidash.country;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

public class BaseAdapter {
    @Autowired
    protected JdbcTemplate jdbcTemplate;
}