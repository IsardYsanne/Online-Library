import React, {useEffect, useState} from 'react';
import stat from "../../styles/statistics.module.scss";
import Stat from "./Stat.jsx";

const getAllStatisticsUrl = 'http://localhost:8080/statistics/show_all';

const Statistics = (props) => {

    const [show, setShow] = useState(false);
    const [statistics, setStatistics] = useState([]);

    useEffect(() => {
        fetch(getAllStatisticsUrl)
            .then(response => response.json())
            .then(statistics => setStatistics(statistics));
    }, []);

    const {
        text,
    } = props;

    return (
        <div>
            <p className={stat.link}
               onClick={() => setShow(!show)}
            >
                {text}
            </p>
            {show ?
                <div className={stat.stat_container}>
                    <table className={stat.table_header}>
                        <tbody>
                            <tr className={stat.tr_header}>
                                <td className={stat.td_header}>Название книги</td>
                                <td className={stat.td_header}>Ник пользователя</td>
                                <td className={stat.td_header}>Дата прочтения</td>
                            </tr>
                        </tbody>
                    </table>
                    {
                        statistics.map((statistic, key) => (

                            <Stat
                                key={key}
                                statistic={statistic}
                            />
                        ))
                    }
                </div>
                : ""
            }
        </div>
    );
};

export default Statistics;