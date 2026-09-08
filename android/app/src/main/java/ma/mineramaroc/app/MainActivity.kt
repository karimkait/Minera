package ma.mineramaroc.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.webkit.*
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

/**
 * MinéraMaroc - Activité principale Android
 *
 * Compatible Android 5.0+ (API 21 Lollipop jusqu'à Android 14/15 API 34+)
 * Intègre le moteur WebView haute performance avec accélération matérielle,
 * gestion de l'appareil photo (reconnaissance de roches par IA), géolocalisation
 * des carreaux miniers et téléchargement des bordereaux d'expédition Loi 33-13.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefresh: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var errorLayout: LinearLayout
    private lateinit var btnRetry: Button

    // URL de production ou de développement de l'application MinéraMaroc
    // Peut être remplacé par l'URL hébergée ou file:///android_asset/dist/index.html pour du 100% offline
    private val appUrl = "https://ais-pre-fqjgpsu7r3bboi6hhur4ak-830815737483.europe-west2.run.app"

    // Gestionnaire de sélection de fichiers / appareil photo pour le dépouillement IA et fiches techniques
    private var filePathCallback: ValueCallback<Array<Uri>>? = null

    // Enregistrement du résultat pour la sélection de fichiers ou capture photo
    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (filePathCallback == null) return@registerForActivityResult

        val results: Array<Uri>? = when {
            result.resultCode == Activity.RESULT_OK && result.data != null -> {
                val dataString = result.data?.dataString
                val clipData = result.data?.clipData

                if (clipData != null) {
                    val count = clipData.itemCount
                    Array(count) { i -> clipData.getItemAt(i).uri }
                } else if (dataString != null) {
                    arrayOf(Uri.parse(dataString))
                } else {
                    null
                }
            }
            else -> null
        }

        filePathCallback?.onReceiveValue(results)
        filePathCallback = null
    }

    // Gestionnaire des permissions d'exécution (Caméra & Position GPS)
    private val permissionsLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val cameraGranted = permissions[Manifest.permission.CAMERA] ?: false
        val locationGranted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] ?: false

        if (!cameraGranted) {
            Toast.makeText(this, "L'accès caméra optimise la reconnaissance IA des minerais.", Toast.LENGTH_SHORT).show()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 1. Initialisation des composants visuels
        webView = findViewById(R.id.webView)
        swipeRefresh = findViewById(R.id.swipeRefreshLayout)
        progressBar = findViewById(R.id.progressBar)
        errorLayout = findViewById(R.id.errorLayout)
        btnRetry = findViewById(R.id.btnRetry)

        // 2. Configuration du pull-to-refresh (Couleurs thème Ambre / MinéraMaroc)
        swipeRefresh.setColorSchemeResources(R.color.primary, R.color.secondary)
        swipeRefresh.setOnRefreshListener {
            webView.reload()
        }

        // 3. Bouton de réessai en cas d'erreur de connexion réseau
        btnRetry.setOnClickListener {
            errorLayout.visibility = View.GONE
            webView.visibility = View.VISIBLE
            webView.reload()
        }

        // 4. Configuration optimisée du WebView pour Android 5.0+
        setupWebView()

        // 5. Demande proactive des permissions pour géologues de terrain
        checkPermissions()

        // 6. Chargement de l'application
        if (savedInstanceState == null) {
            webView.loadUrl(appUrl)
        } else {
            webView.restoreState(savedInstanceState)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings = webView.settings

        // Activation de JavaScript pour React et les graphiques Recharts
        settings.javaScriptEnabled = true

        // Stockage local et cache pour la persistance des lots et demandes d'achat
        settings.domStorageEnabled = true
        settings.databaseEnabled = true

        // Cache intelligent adapté aux zones minières à faible couverture réseau
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        // Géolocalisation pour le repérage des gisements
        settings.setGeolocationEnabled(true)

        // Support du zoom et responsive
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.setSupportZoom(true)
        settings.builtInZoomControls = true
        settings.displayZoomControls = false

        // Gestion des médias et téléchargements
        settings.mediaPlaybackRequiresUserGesture = false
        settings.allowFileAccess = true

        // WebChromeClient pour la gestion de la barre de progression, alertes et upload de photos
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                if (newProgress < 100) {
                    progressBar.visibility = View.VISIBLE
                    progressBar.progress = newProgress
                } else {
                    progressBar.visibility = View.GONE
                    swipeRefresh.isRefreshing = false
                }
            }

            // Gestion de l'appareil photo et de la galerie pour l'analyse IA de roches
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePathCallback

                val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                    type = "*/*"
                    addCategory(Intent.CATEGORY_OPENABLE)
                }

                try {
                    fileChooserLauncher.launch(intent)
                } catch (e: Exception) {
                    this@MainActivity.filePathCallback = null
                    return false
                }
                return true
            }

            // Permissions de géolocalisation HTML5 pour la carte des concessions
            override fun onGeolocationPermissionsShowPrompt(
                origin: String?,
                callback: GeolocationPermissions.Callback?
            ) {
                callback?.invoke(origin, true, false)
            }
        }

        // WebViewClient pour la navigation interne et le traitement d'erreurs
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false

                // Ouvrir les liens WhatsApp, téléphones et emails dans les apps natives
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("whatsapp:")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        Toast.makeText(this@MainActivity, "Application compatible non trouvée.", Toast.LENGTH_SHORT).show()
                    }
                }
                return false
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                swipeRefresh.isRefreshing = false
            }

            override fun onReceivedError(
                view: WebView?,
                errorCode: Int,
                description: String?,
                failingUrl: String?
            ) {
                super.onReceivedError(view, errorCode, description, failingUrl)
                // En cas de perte de connexion en zone désertique/mine
                webView.visibility = View.GONE
                errorLayout.visibility = View.VISIBLE
                swipeRefresh.isRefreshing = false
            }
        }
    }

    private fun checkPermissions() {
        val permissionsToRequest = mutableListOf<String>()

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            permissionsToRequest.add(Manifest.permission.CAMERA)
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            permissionsToRequest.add(Manifest.permission.ACCESS_FINE_LOCATION)
        }

        if (permissionsToRequest.isNotEmpty()) {
            permissionsLauncher.launch(permissionsToRequest.toTypedArray())
        }
    }

    // Gestion du bouton Retour physique d'Android : reculer dans l'historique du site au lieu de quitter l'application
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }
}
