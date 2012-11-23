<?xml version="1.0" encoding="iso-8859-15"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
    <xsl:apply-templates select="/rss/channel"/>
</xsl:template>
<xsl:template match="channel">
    <xsl:call-template name="header"/>
    <xsl:call-template name="body"/>
    <xsl:call-template name="footer"/>
</xsl:template>
<xsl:template name="header">
    <div id="header">
        <p>
            <xsl:element name="img">
                <xsl:attribute name="id">logo</xsl:attribute>
                <xsl:attribute name="src"><xsl:value-of select="image/url"/></xsl:attribute>
                <xsl:attribute name="alt"><xsl:value-of select="image/description"/></xsl:attribute>
            </xsl:element>
        </p>
        <h1><xsl:value-of select="title"/></h1>
        <p id="lastBuildDate">
            Derniere mise a jour:
            <span class="timestamp"><xsl:value-of select="lastBuildDate"/></span>
        </p>
    </div>
</xsl:template>
<xsl:template name="body">
    <dl>
        <xsl:for-each select="item">
            <dt>
		<xsl:element name="a">
			<xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
			<xsl:value-of select="title"/>
		</xsl:element>
		<span class="pubDate">
		    emiddot;
		    <span class="timestamp"><xsl:value-of select="pubDate"/></span>
		</span>
            </dt>
            <dd>
                <p><xsl:value-of select="description"/></p>
            </dd>
        </xsl:for-each>
    </dl>
</xsl:template>
<xsl:template name="footer">
    <p class="footer"><xsl:value-of select="copyright"/></p>
</xsl:template>
</xsl:stylesheet>
