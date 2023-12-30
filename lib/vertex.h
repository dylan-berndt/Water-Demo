

#ifndef PIPE_VERTEX_H
#define PIPE_VERTEX_H

#include "back.h"

class Vertex {
public:
    Vertex() {
        position = glm::vec3(0.0); color = glm::vec3(0.0); texCoord = glm::vec2(0.0);
    }
    Vertex(glm::vec3 p, glm::vec3 c = glm::vec3(0.0), glm::vec2 t = glm::vec2(0.0)) {
        position = p; color = c; texCoord = t;
    }
    Vertex(glm::vec3 p, glm::vec2 t) {
        position = p; color = glm::vec3(0.0); texCoord = t;
    }
    Vertex(float x, float y, float z) {
        position = glm::vec3(x, y, z); color = glm::vec3(0.0); texCoord = glm::vec2(0.0);
    }
    glm::vec3 position;
    glm::vec3 color;
    glm::vec2 texCoord;
};

class VertexArray {
public:
    void bind() const;
    static void unbind();
    virtual void draw() const;
    VertexArray(Vertex *v, int size, int mode = GL_STATIC_DRAW);
    unsigned int VAO;
    unsigned int VBO;
    Vertex *vertices;
    int amount;
};

class IndexedArray : public VertexArray {
public:
    void draw() const;
    IndexedArray(Vertex *v, int vsize, unsigned int *i, int isize, int mode = GL_STATIC_DRAW);
private:
    unsigned int EBO;
    unsigned int *indices;
};


#endif //PIPE_VERTEX_H
