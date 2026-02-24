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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var gray_matter_1 = __importDefault(require("gray-matter"));
var payload_1 = require("payload");
var _payload_config_1 = __importDefault(require("@payload-config"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env.local' });
var LOCALE_MAP = {
    en: 'en',
    zh: 'zh',
    de: 'de',
    es: 'es',
    fr: 'fr',
    hi: 'hi',
    id: 'id',
    it: 'it',
    ja: 'ja',
    ko: 'ko',
    nl: 'nl',
    pt: 'pt',
    ru: 'ru',
    th: 'th',
    vi: 'vi',
};
function patchFAQs() {
    return __awaiter(this, void 0, void 0, function () {
        var payload, articlesDir, locales, updateCount, _i, locales_1, locale, localeDir, files, _a, files_1, file, filePath, fileContent, data, slug, language, faqs, category, existing, doc;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, payload_1.getPayload)({ config: _payload_config_1.default })];
                case 1:
                    payload = _b.sent();
                    console.log('Starting FAQ patch from Markdown to Payload CMS...');
                    articlesDir = path_1.default.join(process.cwd(), 'src/content/articles');
                    if (!fs_1.default.existsSync(articlesDir)) {
                        console.error('Articles directory not found at', articlesDir);
                        process.exit(1);
                    }
                    locales = fs_1.default.readdirSync(articlesDir).filter(function (dir) { return !dir.startsWith('.'); });
                    updateCount = 0;
                    _i = 0, locales_1 = locales;
                    _b.label = 2;
                case 2:
                    if (!(_i < locales_1.length)) return [3 /*break*/, 9];
                    locale = locales_1[_i];
                    localeDir = path_1.default.join(articlesDir, locale);
                    if (!fs_1.default.statSync(localeDir).isDirectory())
                        return [3 /*break*/, 8];
                    files = fs_1.default.readdirSync(localeDir).filter(function (f) { return f.endsWith('.md'); });
                    _a = 0, files_1 = files;
                    _b.label = 3;
                case 3:
                    if (!(_a < files_1.length)) return [3 /*break*/, 8];
                    file = files_1[_a];
                    filePath = path_1.default.join(localeDir, file);
                    fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
                    data = (0, gray_matter_1.default)(fileContent).data;
                    slug = file.replace('.md', '');
                    language = LOCALE_MAP[locale] || 'en';
                    faqs = Array.isArray(data.faqs) ? data.faqs.map(function (f) { return ({
                        question: String(f.question || ''),
                        answer: String(f.answer || ''),
                    }); }) : [];
                    category = typeof data.category === 'string' ? data.category : 'Relationships';
                    if (faqs.length === 0 && !data.category) {
                        // If there's neither FAQ nor category explicitly in the matter, maybe just skip patching to be faster
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, payload.find({
                            collection: 'articles',
                            where: {
                                and: [
                                    { slug: { equals: slug } },
                                    { language: { equals: language } }
                                ]
                            }
                        })];
                case 4:
                    existing = _b.sent();
                    if (!(existing.docs.length > 0)) return [3 /*break*/, 6];
                    doc = existing.docs[0];
                    return [4 /*yield*/, payload.update({
                            collection: 'articles',
                            id: doc.id,
                            data: {
                                faqs: faqs,
                                category: category,
                            },
                        })];
                case 5:
                    _b.sent();
                    console.log("[UPDATED] ".concat(slug, " (").concat(language, ") - FAQs: ").concat(faqs.length));
                    updateCount++;
                    return [3 /*break*/, 7];
                case 6:
                    console.log("[NOT FOUND IN CMS] ".concat(slug, " (").concat(language, ") - Skipping update"));
                    _b.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 3];
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9:
                    console.log("\n\u2705 Patching complete! Updated ".concat(updateCount, " articles with FAQs & Category."));
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
patchFAQs().catch(function (err) {
    console.error(err);
    process.exit(1);
});
