import React, {useEffect, useState} from 'react';
import styles from "../../styles/book.module.scss";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faSquareXmark, faPenToSquare, faEye, faSquareCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const editBookUrl = 'http://localhost:8080/books/update';
const removeBookUrl = 'http://localhost:8080/books/delete';
const editImageBookUrl = 'http://localhost:8080/books/update_image';
const saveBookFileUrl = 'http://localhost:8080/books/save_pdf';
const sendStatisticUrl = 'http://localhost:8080/statistics/save';
const getStatisticsByUserNameAndTitleUrl = 'http://localhost:8080/statistics/show/';

const Book = (props) => {

    const [status, setStatus] = useState("");
    const [title, setTitle] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [base64URL, setBase64URL] = useState("");
    const [base64URLPdf, setBase64URLPdf] = useState("");
    const [statistics, setStatistics] = useState("");

    library.add(faSquareXmark);
    library.add(faPenToSquare);
    library.add(faEye);
    library.add(faSquareCheck);

    const {
        book,
        image,
        username
    } = props;

    const showFormFunction = () => {
        setShowForm(!showForm);
    };

    const validate = (data) => {
        return !data;
    }

    useEffect(() => {
        fetch(getStatisticsByUserNameAndTitleUrl + `${username}/${book.title}`)
            .then(response => response.json())
            .then(statistic => setStatistics(statistic));
    }, []);

    const editBook = (title, book) => {
        fetch(editBookUrl, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: book.id,
                title,
                authors: book.authors,
                genre: book.genre,
                base64URL,
            })
        }).then(() => {
            fetch(saveBookFileUrl, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    bookName: title,
                    pdfBook: base64URLPdf
                })
            });
        });
    };

    const removeBook = (id) => {
        if (window.confirm("Вы действительно хотите удалить эту книгу?")) {
            fetch(removeBookUrl + '?id=' + id, {
                method: 'delete'
            }).then(() => setStatus('Delete successful'));
        }
    };

    const removeImage = (book) => {
        let isDeleteImage = true;
        if (window.confirm("Вы действительно хотите удалить обложку?")) {
            fetch(editImageBookUrl, {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: book.id,
                    title: book.title,
                    authors: book.authors,
                    genre: book.genre,
                    base64URL: book.base64URL,
                    isDeleteImage
                })
            });
        }
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

    const handleFileInputChange = e => {

        let selectedImage = e.target.files[0];

        getBase64(selectedImage)
            .then(result => {
                selectedImage["base64"] = result;
                console.log("File is ", selectedImage);
                let res = result.replace('data:image/jpeg;base64,', '');
                setBase64URL(res);
                setSelectedImage(selectedImage);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const openBook = (title) => {
        fetch(`${title}.pdf`)
            .then(response => {
                response.blob().then(blob => {
                    const fileURL = window.URL.createObjectURL(blob);
                    let alink = document.createElement('a');
                    alink.href = fileURL;
                    alink.target = "_blank";
                    alink.click();
                })
            })
    }

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

    const sendStatistic = (title) => {
        if (window.confirm("Вы действительно хотите отметить эту книгу прочитанной?")) {
            fetch(sendStatisticUrl, {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userName: username,
                    title: title,
                    isBookRead: true
                })
            });
        }
    }

    return (
        showForm ?
            // Форма изменения книги.
            <form className={styles.formWrapper}>
                <label htmlFor={1} className={styles.formLabel}>
                    Введите название книги
                </label>
                <input
                    id={1}
                    className={styles.inputForm}
                    type={"text"}
                    onChange={(e) => {
                        e.preventDefault();
                        setTitle(e.target.value);
                    }}
                    pattern={"\\s*\\S+.*"}
                    placeholder={book.title}
                    required
                />
                <label htmlFor={2} className={styles.formLabel}>
                    Загрузите обложку книги:
                </label>
                <input
                    type={"file"}
                    className={styles.inputImage}
                    onChange={(event) => {
                        handleFileInputChange(event);
                    }}
                />
                <label htmlFor={3} className={styles.formLabel}>
                    Загрузите pdf-файл книги:
                </label>
                <input
                    type={"file"}
                    className={styles.inputImage}
                    onChange={(event) => {
                        handleFilePdf(event);
                    }}
                />
                <div className={styles.btn_container}>
                    <button
                        className={styles.btnSubmit}
                        type={"submit"}
                        onClick={() => editBook(title, book)}
                        disabled={validate(title) || validate(base64URLPdf) || validate(base64URL)}
                    >
                        Сохранить
                    </button>
                    <button
                        className={styles.btnExit}
                        onClick={showFormFunction}
                    >
                        Отмена
                    </button>
                </div>
            </form>
            :
            // Отображение книги на главной странице.
            <div className={styles.book_wrapper}>
                <div className={styles.book_column}>
                    <div className={styles.book_title}>
                        {book.title}
                    </div>
                    <div>
                        {book.base64URL ?
                            <div className={styles.image_container}>
                                <img alt="обложка не задана" src={`data:image/jpeg;base64, ${book.base64URL}`}/>
                                <FontAwesomeIcon
                                    icon="fa-solid fa-square-xmark"
                                    className={styles.remove_image_icon}
                                    onClick={() => removeImage(book)}
                                />
                            </div>
                            : "Изображение не задано."
                        }
                    </div>
                    <div className={styles.book_authors}>
                        {book.authors}
                    </div>
                    <div className={styles.book_genre}>
                        {book.genre}
                    </div>
                    <div className={styles.book_menu}>
                        <div className={styles.book_edit}>
                            <FontAwesomeIcon
                                icon="fa-solid fa-pen-to-square"
                                className={styles.edit_icon}
                                onClick={showFormFunction}
                            />
                        </div>
                        <div className={styles.book_remove}>
                            <FontAwesomeIcon
                                icon="fa-solid fa-square-xmark"
                                className={styles.remove_icon}
                                onClick={() => removeBook(book.id)}
                            />
                        </div>
                        <div className={styles.book_read}>
                            <FontAwesomeIcon
                                icon="fa-solid fa-eye"
                                className={styles.read_icon}
                                onClick={() => openBook(book.title)}
                            />
                        </div>
                        <div className={styles.book_done}>
                            <FontAwesomeIcon
                                icon="fa-solid fa-square-check"
                                className={statistics.isBookRead ? styles.done_icon : styles.not_done_icon}
                                onClick={() => sendStatistic(book.title)}
                            />
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Book;