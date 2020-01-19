const Op = require('sequelize').Op;
const models = require('../models');
const fs = require('fs');
const storeFS = ({ stream, filename }) => {
    const uploadDir = '../photos';
    const path = `${uploadDir}/${filename}`;
    return new Promise((resolve, reject) =>
        stream
            .on('error', error => {
                if (stream.truncated)
                    // delete the truncated file
                    fs.unlinkSync(path);
                reject(error);
            })
            .pipe(fs.createWriteStream(path))
            .on('error', error => reject(error))
            .on('finish', () => resolve({ path }))
    );
}
export const getPhotos = async (args) => {
    const page = args.page;
    const photos = await models.Photo.findAll({
        offset: (page - 1) * 10,
        limit: 10
    });
    const totalPhotos = await models.Photo.count();
    return {
        photos,
        page,
        totalPhotos
    };
}
export const addPhoto = async (args) => {
    const { description, tags } = args;
    const { filename, mimetype, createReadStream } = await args.file;
    const stream = createReadStream();
    const pathObj = await storeFS({ stream, filename });
    const fileLocation = pathObj.path;
    const photo = await models.Photo.create({
        fileLocation,
        description,
        tags
    })
    return photo;
}
export const editPhoto = async (args) => {
    const { id, description, tags } = args;
    const { filename, mimetype, createReadStream } = await args.file;
    const stream = createReadStream();
    const pathObj = await storeFS({ stream, filename });
    const fileLocation = pathObj.path;
    const photo = await models.Photo.update({
        fileLocation,
        description,
        tags
    }, {
        where: {
            id
        }
    })
    return photo;
}
export const deletePhoto = async (args) => {
    const { id } = args;
    await models.Photo.destroy({
        where: {
            id
        }
    })
    return id;
}
export const searchPhotos = async (args) => {
    const searchQuery = args.searchQuery;
    const photos = await models.Photo.findAll({
        where: {
            [Op.or]: [
                {
                    description: {
                        [Op.like]: `%${searchQuery}%`
                    }
                },
                {
                    tags: {
                        [Op.like]: `%${searchQuery}%`
                    }
                }
            ]
        }
    });
    const totalPhotos = await models.Photo.count();
    return {
        photos,
        totalPhotos
    };
}