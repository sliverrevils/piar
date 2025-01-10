import Head from "next/head";

export interface SeoProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
}

const Seo: React.FC<SeoProps> = ({ title, description, keywords = "", image = "/default-image.jpg", url = "" }) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Мебельный магазин" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Favicon */}
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
};

export default Seo;
