package hu.tilos.radio.backend.episode;

import ch.qos.logback.classic.Level;
import hu.tilos.radio.backend.TestUtil;
import hu.tilos.radio.backend.data.types.EpisodeData;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.text.SimpleDateFormat;
import java.util.List;

public class PersistentEpisodeProviderTest {

    private static final SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    private static DataSource ds;

    @BeforeClass
    public static void setUp() {
        ds = TestUtil.initDatasource();
        TestUtil.initTestData();
    }

    @Test
    public void testListEpisode() throws Exception {
        //given
        PersistentEpisodeProvider p = new PersistentEpisodeProvider();
        p.setEntityManager(TestUtil.initPersistence().createEntityManager());


        //when
        List<EpisodeData> episodes = p.listEpisode(1, SDF.parse("2014-04-03 12:00:00"), SDF.parse("2014-05-03 12:00:00"));

        //then
        Assert.assertEquals(2, episodes.size());
        Assert.assertNotNull(episodes.get(0).getShow());
 //       Assert.assertNotNull(episodes.get(0).getText());
//        Assert.assertEquals("Jo kis beszelgetes 1", episodes.get(0).getText().getTitle());
        Assert.assertNotNull(episodes.get(1).getText());
        Assert.assertEquals("Jo musor",episodes.get(1).getText().getTitle());


    }
}