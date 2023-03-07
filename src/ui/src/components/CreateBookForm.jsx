import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import library from "../styles/library.module.scss";
import styles from "../styles/book.module.scss";

const addBookUrl = 'http://localhost:8080/books/save';
const saveBookFileUrl = 'http://localhost:8080/books/save_pdf';

const getAllAuthors = 'http://localhost:8080/authors/show_all';
const getAllGenres = 'http://localhost:8080/genres/show_all';

const CreateBookForm = (props) => {

    const {
        show,
        setShow,
        isBookForm,
        setIsBookForm,
    } = props;

    const [authorsArray, setAuthorsArray] = useState([]);
    const [genreArray, setGenreArray] = useState([]);

    const [authors, setAuthors] = useState("");
    const [genre, setGenre] = useState("");
    const [title, setTitle] = useState("");
    const [isCreated, setIsCreated] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [base64URL, setBase64URL] = useState("");
    const [selectedPdf, setSelectedPdf] = useState("");
    const [base64URLPdf, setBase64URLPdf] = useState("");

    const route = useNavigate();

    const validate = (data) => {
        return !data;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        route('/');
    }

    useEffect(() => {
        fetch(getAllAuthors)
            .then(response => response.json())
            .then(auth => setAuthorsArray(auth));
    }, []);

    useEffect(() => {
        fetch(getAllGenres)
            .then(response => response.json())
            .then(genres => setGenreArray(genres));
    }, []);

    const rejectBookForm = () => {
        setShow(!show);
        setIsBookForm(!isBookForm);
    };

    const addBook = () => {
        fetch(addBookUrl, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title,
                authors,
                genre,
                base64URL,
                isBookRead: false
            })
        }).then(() => setIsCreated(!isCreated))
            .then(() => {
                fetch(saveBookFileUrl, {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        bookName: title,
                        pdfBook: base64URLPdf
                    })
                }).then(() => setIsCreated(!isCreated));
            });
    };

    const getBase64 = (file) => {
        return new Promise(resolve => {
            let baseURL = "";
            let reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                baseURL = reader.result;
                console.log(baseURL);
                resolve(baseURL);
            };
        });
    };

    const handleFileInputChange = (e) => {
        let selectedImage = e.target.files[0];

        getBase64(selectedImage)
            .then(result => {
                selectedImage["base64"] = result;
                console.log("File ", selectedImage);
                let res = result.replace('data:image/jpeg;base64,', '');
                setBase64URL(res);
                setSelectedImage(selectedImage);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleFilePdf = (e) => {
        let selectedPdf = e.target.files[0];

        getBase64(selectedPdf)
            .then(result => {
                selectedPdf["base64"] = result;
                console.log("File ", selectedPdf);
                let res = result.replace('data:application/pdf;base64,', '');
                setBase64URLPdf(res);
                setSelectedPdf(selectedPdf);
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <div className={library.addBookForm}>
            <div className={library.formTitle}>Создать книгу</div>
            <form
                className={library.formWrapper}
                onSubmit={(e) => handleSubmit(e)}
            >
                <label htmlFor={1} className={library.formLabel}>
                    Введите название книги
                </label>
                <input
                    id={1}
                    className={library.inputForm}
                    type={"text"}
                    onChange={(e) => {
                        e.preventDefault();
                        setTitle(e.target.value);
                    }}
                    pattern={"\\s*\\S+.*"}
                />
                <label htmlFor={2} className={library.formLabel}>
                    Выберите автора книги
                </label>
                <select
                    id={2}
                    className={library.inputForm}
                    value={authors}
                    onChange={(e) => {
                        setAuthors(e.target.value);
                    }}
                >
                    {authorsArray && authorsArray.map((author) => (
                            <option
                                key={author.id}
                                value={author.name}
                            >
                                {author.name}
                            </option>
                        )
                    )}
                </select>
                <label htmlFor={3} className={library.formLabel}>
                    Выберите жанр книги
                </label>
                <select
                    id={3}
                    className={library.inputForm}
                    value={genre}
                    onChange={(e) => {
                        setGenre(e.target.value);
                    }}
                >
                    {genreArray && genreArray.map((genre) => (
                            <option
                                key={genre.id}
                                value={genre.genreName}
                            >
                                {genre.genreName}
                            </option>
                        )
                    )}
                </select>
                <label htmlFor={4} className={library.formLabel}>
                    Загрузите обложку книги:
                </label>
                <input
                    type={"file"}
                    className={library.inputImage}
                    onChange={(event) => {
                        handleFileInputChange(event);
                    }}
                />
                <label htmlFor={5} className={styles.formLabel}>
                    Загрузите pdf-файл книги:
                </label>
                <input
                    type={"file"}
                    className={styles.inputPdf}
                    onChange={(event) => {
                        handleFilePdf(event);
                    }}
                />
                <div className={library.btn_container}>
                    <button
                        className={library.btnSubmit}
                        type={"submit"}
                        onClick={addBook}
                        disabled={validate(title) || validate(authors) || validate(genre) || validate(base64URLPdf)}
                    >
                        Сохранить
                    </button>
                    <button
                        className={library.btnExit}
                        onClick={rejectBookForm}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBookForm;