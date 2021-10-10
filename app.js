const app = {
    data() {
        return {
            DICT: "https://dictionary.cambridge.org/dictionary/english/",
            ALPHABET: "abcdefghijklmnopqrstuvwxyz".split(""),
            MIN_CHARACTERS: 2,
            wordList: [],
            nextLetter: "",
            score: 0,
            input: {
                value: "",
                placeholder: "",
                disabled: true,
            },
            ERROR: "",
            timerCount: 60,
            timerEnabled: false,
        };
    },
    methods: {
        startGame() {
            this.setPlaceholdersFirstLetterRandom();
            this.timerEnabled = true;
            this.input.disabled = false;
        },
        endGame() {
            alert(`Your score is ${this.score}. Good job!`);
            this.timerEnabled = false;
            this.input.disabled = true;
            this.input.value = "";
            this.input.placeholder = "";
            this.ERROR = "";
            this.score = 0;
            this.timerCount = 60;
            this.nextLetter = "";
            this.wordList = [];
        },
        async addWordToList() {
            if (
                this.checkCharacterLength(this.input.value, this.MIN_CHARACTERS)
            ) {
                this.ERROR = `The word must be at least ${this.MIN_CHARACTERS} characters.`;
                this.input.value = "";
                return;
            }

            if (this.checkIfExist(this.input.value, this.wordList)) {
                this.ERROR = "This word available in word list!";
                this.input.value = "";
                return;
            }

            if (this.hasNumber(this.input.value)) {
                this.ERROR = "The word can not contain numbers!";
                this.input.value = "";
                return;
            }

            if (
                this.checkFirstAndNextLetter(
                    this.getFirstLetter(this.input.value),
                    this.nextLetter
                )
            ) {
                this.ERROR = `The first letter of word must be '${this.nextLetter}'!`;
                this.input.value = "";
                return;
            }

            if (await this.checkWordExistInEnglish(this.input.value)) {
                this.ERROR = "This word is undefined!";
                this.input.value = "";
                return;
            }

            this.wordList.push(this.input.value);
            this.nextLetter = this.getLastLetter(this.input.value);
            this.input.placeholder = this.nextLetter;
            this.input.value = "";
            this.ERROR = "";
            this.score = this.score + 1;
        },
        setPlaceholdersFirstLetterRandom() {
            this.input.placeholder =
                this.ALPHABET[
                    Math.floor(Math.random() * this.ALPHABET.length + 1)
                ];
            this.nextLetter = this.input.placeholder;
        },
        async checkWordExistInEnglish(word) {
            const api = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
            const res = await fetch(api);
            const json = await res.json();
            return json.title == "No Definitions Found";
        },
        getFirstLetter: (str) => str.charAt(0).toLowerCase(),
        getLastLetter: (str) => str.charAt(str.length - 1).toLowerCase(),
        hasNumber: (str) => /\d/.test(str),
        checkCharacterLength: (str, min) => str.length < min,
        checkIfExist: (str, list) =>
            list.filter((word) => word.toLowerCase() == str.toLowerCase())
                .length > 0,
        checkFirstAndNextLetter: (first, next) => first != next,
        play: () => (this.timerEnabled = true),
        pause: () => (this.timerEnabled = false),
    },
    watch: {
        timerEnabled(value) {
            if (value) {
                setTimeout(() => this.timerCount--, 1000);
            }
        },
        timerCount: {
            immediate: true, // This ensures the watcher is triggered upon creation
            handler(value) {
                if (value > 0 && this.timerEnabled) {
                    setTimeout(() => this.timerCount--, 1000);
                }
                if (value == 0) {
                    this.endGame();
                }
            },
        },
    },
};
Vue.createApp(app).mount("#app");
