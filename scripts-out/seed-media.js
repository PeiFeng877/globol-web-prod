"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var payload_1 = require("payload");
var _payload_config_1 = __importDefault(require("@payload-config"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env.local' });
function getFilesRecursively(dir, fileList) {
    if (fileList === void 0) { fileList = []; }
    if (!fs_1.default.existsSync(dir))
        return fileList;
    var files = fs_1.default.readdirSync(dir);
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var filePath = path_1.default.join(dir, file);
        if (fs_1.default.statSync(filePath).isDirectory()) {
            getFilesRecursively(filePath, fileList);
        }
        else {
            // Filter out non-image files like .DS_Store
            if (/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(file)) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
}
function seedMedia() {
    return __awaiter(this, void 0, void 0, function () {
        var payload, assetsDir, avatarsDir, mediaFiles, count, _i, mediaFiles_1, filePath, filename, existing, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, payload_1.getPayload)({ config: _payload_config_1.default })];
                case 1:
                    payload = _a.sent();
                    console.log('Seeding existing images into Payload Media...');
                    assetsDir = path_1.default.join(process.cwd(), 'public/assets');
                    avatarsDir = path_1.default.join(process.cwd(), 'public/avatars');
                    mediaFiles = __spreadArray(__spreadArray([], getFilesRecursively(assetsDir), true), getFilesRecursively(avatarsDir), true);
                    count = 0;
                    _i = 0, mediaFiles_1 = mediaFiles;
                    _a.label = 2;
                case 2:
                    if (!(_i < mediaFiles_1.length)) return [3 /*break*/, 8];
                    filePath = mediaFiles_1[_i];
                    filename = path_1.default.basename(filePath);
                    return [4 /*yield*/, payload.find({
                            collection: 'media',
                            where: {
                                filename: { equals: filename }
                            },
                        })];
                case 3:
                    existing = _a.sent();
                    if (existing.docs.length > 0) {
                        console.log("[SKIP] Media already exists: ".concat(filename));
                        return [3 /*break*/, 7];
                    }
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, payload.create({
                            collection: 'media',
                            data: {
                                alt: filename.replace(/\.[^/.]+$/, ''), // filename without extension
                            },
                            filePath: filePath,
                        })];
                case 5:
                    _a.sent();
                    console.log("[CREATED] Media: ".concat(filename));
                    count++;
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    console.error("[ERROR] Failed to save media ".concat(filename, ":"), err_1.message);
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8:
                    console.log("\n\u2705 Media Seeding complete! Uploaded ".concat(count, " new files via Payload."));
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
seedMedia().catch(function (err) {
    console.error(err);
    process.exit(1);
});
