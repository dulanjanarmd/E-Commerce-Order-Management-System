package com.lankathread.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String slug;
    
    private String description;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @ManyToOne
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private Category parent;
    
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Category> subcategories;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Product> products;
    
    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "is_pinned")
    private Boolean isPinned = false;

    @Column(name = "pin_order")
    private Integer pinOrder;
    
    private Boolean active = true;

    @Transient
    private Long parentId;

    public Long getParentId() {
        if (parentId != null) return parentId;
        return parent != null ? parent.getId() : null;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
}
