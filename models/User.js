import thinky from '../libs/rethink'
var type = thinky.type;

export default thinky.createModel("users", {
    id: String
});
