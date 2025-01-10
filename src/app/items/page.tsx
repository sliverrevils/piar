import ItemsList from "../components/items/ItemsList/ItemsList";
import styles from "./itemsPage.module.scss";

export default function ItemsPage() {
    return (
        <article className={styles.itemsPageWrap}>
            <h1> Items Page</h1>
            <ItemsList />
        </article>
    );
}
