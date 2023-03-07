import React from 'react';
import stat from "../../styles/statistics.module.scss";

const Stat = (props) => {

    const {
        key,
        statistic,
    } = props;

    return (
        <table>
            <tbody>
                <tr className={stat.tr}>
                    <td className={stat.td}>{statistic.title}</td>
                    <td className={stat.td}>{statistic.userName}</td>
                    <td className={stat.td}>{statistic.readDate}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default Stat;