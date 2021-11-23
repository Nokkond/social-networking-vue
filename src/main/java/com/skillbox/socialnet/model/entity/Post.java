package com.skillbox.socialnet.model.entity;

import lombok.Data;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "time")
    private Timestamp time;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private Person author;
    @Column(name = "title")
    private String title;
    @Column(name = "post_text")
    private String postText;
    @Column(name = "is_blocked")
    private boolean isBlocked;
}
