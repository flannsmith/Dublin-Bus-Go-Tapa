from invoke import Local

def webpack():
    
    Local('rm -rf dublinBus/static/bundles/stage/*')
    Local('rm -rf dublinBus/static/bundles/prod/*')
    Local('webpack --config webpack.stage.config.js --progress --colors')
    Local('webpack --config webpack.prod.config.js --progress --colors')

if __name__ == '__main__':
    webpack()
