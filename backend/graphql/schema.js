const { buildSchema } = require('graphql');
export const schema = buildSchema(`
    scalar Upload
type Photo {
        id: Int,
        fileLocation: String,
        description: String,
        tags: String
    }
type PhotoData {
        photos: [Photo],
        page: Int,
        totalPhotos: Int
    }
type Query {
        getPhotos(page: Int): PhotoData,
        searchPhotos(searchQuery: String): PhotoData
    }
type Mutation {
        addPhoto(file: Upload!, description: String, tags: String): Photo
        editPhoto(id: Int, file: Upload!, description: String, tags: String): Photo
        deletePhoto(id: Int): Int
    }
`);